// Firestore security rules: bookings and booking chat messages.
//
// Every rule is tested both ways: what must be allowed (assertSucceeds) and what must be denied (assertFails).
// Runs only against the local Firestore emulator under a "demo-" project id, so it can never
// reach the live Firebase project. Run with:  npm run test:rules
import { test, before, after, describe } from 'node:test';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs, query, where,
  serverTimestamp, Timestamp,
} from 'firebase/firestore';

const PROJECT = 'demo-wilayathub';
const RULES = fileURLToPath(new URL('../../firestore.rules', import.meta.url));
const WHEN = Timestamp.fromDate(new Date('2026-12-01T10:00:00Z'));

async function makeEnv() {
  // Host/port come from FIRESTORE_EMULATOR_HOST, which "firebase emulators:exec" sets.
  const env = await initializeTestEnvironment({ projectId: PROJECT, firestore: { rules: fs.readFileSync(RULES, 'utf8') } });
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    for (const c of ['alice', 'bob', 'eve', 'paula']) {
      await setDoc(doc(db, `customers/${c}`), { id: c, uid: c, role: 'customer' });
    }
    await setDoc(doc(db, 'partners/pat'), { id: 'pat', uid: 'pat', role: 'partner', status: 'approved' });
    await setDoc(doc(db, 'partners/quinn'), { id: 'quinn', uid: 'quinn', role: 'partner', status: 'approved' });
    await setDoc(doc(db, 'partners/paula'), { id: 'paula', uid: 'paula', role: 'partner', status: 'approved' }); // also a customer
    await setDoc(doc(db, 'partners/penny'), { id: 'penny', uid: 'penny', role: 'partner', status: 'pending' });
    await setDoc(doc(db, 'partners/rob'), { id: 'rob', uid: 'rob', role: 'partner', status: 'rejected' });
  });
  return env;
}

/** Seed a booking (and optionally messages) with admin privileges. */
function seeder(env) {
  return async (id, data = {}, messages = {}) => {
    await env.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, `bookings/${id}`), {
        customerId: 'alice', partnerId: 'pat', serviceId: 'electrician', scheduledAt: WHEN,
        status: 'Requested', createdAt: WHEN, ...data,
      });
      for (const [mid, m] of Object.entries(messages)) {
        await setDoc(doc(db, `bookings/${id}/chat_messages/${mid}`), { createdAt: WHEN, ...m });
      }
    });
  };
}

const newBooking = (extra = {}) => ({
  customerId: 'alice', partnerId: 'pat', serviceId: 'electrician', scheduledAt: WHEN,
  status: 'Requested', createdAt: serverTimestamp(), ...extra,
});
const msg = (senderId, extra = {}) => ({ senderId, text: 'Hello', createdAt: serverTimestamp(), ...extra });

describe('bookings and chat', () => {
  let env, seed, n = 0;
  const id = () => `b${++n}`;
  before(async () => { env = await makeEnv(); seed = seeder(env); });
  after(async () => { await env.cleanup(); });
  const as = (uid) => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).firestore();

  describe('reading and listing bookings', () => {
    before(() => seed('read1'));
    test('customer can read their booking', () => assertSucceeds(getDoc(doc(as('alice'), 'bookings/read1'))));
    test('partner can read their booking', () => assertSucceeds(getDoc(doc(as('pat'), 'bookings/read1'))));
    test("another user CANNOT read someone else's booking", () => assertFails(getDoc(doc(as('eve'), 'bookings/read1'))));
    test('signed-out user cannot read a booking', () => assertFails(getDoc(doc(as(null), 'bookings/read1'))));
    test('customer CAN list their bookings (where customerId == uid)', () =>
      assertSucceeds(getDocs(query(collection(as('alice'), 'bookings'), where('customerId', '==', 'alice')))));
    test('partner CAN list their bookings (where partnerId == uid)', () =>
      assertSucceeds(getDocs(query(collection(as('pat'), 'bookings'), where('partnerId', '==', 'pat')))));
    test('unfiltered list of all bookings is denied', () => assertFails(getDocs(collection(as('alice'), 'bookings'))));
    test("listing another customer's bookings is denied", () =>
      assertFails(getDocs(query(collection(as('eve'), 'bookings'), where('customerId', '==', 'alice')))));
    test("listing another partner's bookings is denied", () =>
      assertFails(getDocs(query(collection(as('eve'), 'bookings'), where('partnerId', '==', 'pat')))));
    test('signed-out user cannot list bookings', () =>
      assertFails(getDocs(query(collection(as(null), 'bookings'), where('customerId', '==', 'alice')))));
  });

  describe('creating bookings: customers only, approved partners only', () => {
    test('customer can book an approved partner', () => assertSucceeds(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking())));
    test('customer can include optional address and notes', () =>
      assertSucceeds(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ address: 'Street 1', notes: 'Ring twice' }))));
    test('cannot create a booking in another customer\'s name', () =>
      assertFails(setDoc(doc(as('eve'), `bookings/${id()}`), newBooking({ customerId: 'alice' }))));
    test('a partner cannot create a booking with a victim as the customer', () =>
      assertFails(setDoc(doc(as('pat'), `bookings/${id()}`), newBooking({ customerId: 'alice', partnerId: 'pat' }))));
    test('cannot book yourself (customer == partner)', () =>
      assertFails(setDoc(doc(as('paula'), `bookings/${id()}`), newBooking({ customerId: 'paula', partnerId: 'paula' }))));
    test('cannot book a pending partner', () => assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ partnerId: 'penny' }))));
    test('cannot book a rejected partner', () => assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ partnerId: 'rob' }))));
    test('cannot book a partner that does not exist', () => assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ partnerId: 'ghost' }))));
    test('a user without a customer profile cannot book', () =>
      assertFails(setDoc(doc(as('pat'), `bookings/${id()}`), newBooking({ customerId: 'pat', partnerId: 'quinn' }))));
    test('cannot create a booking that is already Completed', () =>
      assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ status: 'Completed' }))));
    test('cannot create a booking with a rating', () => assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ rating: 5 }))));
    test('cannot add unknown fields (e.g. price)', () => assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ price: 1 }))));
    test('createdAt must be the server time', () => assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ createdAt: WHEN }))));
    test('required fields must be present (no serviceId)', () => {
      const { serviceId, ...rest } = newBooking();
      return assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), rest));
    });
    test('notes longer than 1000 characters are rejected', () =>
      assertFails(setDoc(doc(as('alice'), `bookings/${id()}`), newBooking({ notes: 'x'.repeat(1001) }))));
    test('signed-out user cannot create a booking', () => assertFails(setDoc(doc(as(null), `bookings/${id()}`), newBooking())));
  });

  describe('updating bookings: customerId / partnerId are immutable', () => {
    test('customer CANNOT change partnerId', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { partnerId: 'quinn' })); });
    test('customer CANNOT change customerId', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { customerId: 'bob' })); });
    test('partner CANNOT hand the booking to another customer', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { customerId: 'eve' })); });
    test('partner CANNOT change partnerId', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { partnerId: 'quinn' })); });
    test('partner CANNOT change partnerId together with a valid status move', async () => {
      const b = id(); await seed(b);
      await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Active', partnerId: 'quinn' }));
    });
    test('full overwrite that drops fields is rejected', async () => {
      const b = id(); await seed(b);
      await assertFails(setDoc(doc(as('alice'), `bookings/${b}`), { customerId: 'alice', partnerId: 'pat', status: 'Cancelled' }));
    });
    test('outsider cannot update a booking', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('eve'), `bookings/${b}`), { status: 'Cancelled' })); });
  });

  describe('updating bookings: status by role', () => {
    test('partner can accept (Requested -> Active) with server updatedAt', async () => {
      const b = id(); await seed(b);
      await assertSucceeds(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Active', updatedAt: serverTimestamp() }));
    });
    test('partner can decline (Requested -> Cancelled)', async () => { const b = id(); await seed(b); await assertSucceeds(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Cancelled' })); });
    test('partner can go Active -> On the way -> Completed', async () => {
      const b = id(); await seed(b, { status: 'Active' });
      await assertSucceeds(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'On the way' }));
      await assertSucceeds(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Completed' }));
    });
    test('partner can cancel an Active booking', async () => { const b = id(); await seed(b, { status: 'Active' }); await assertSucceeds(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Cancelled' })); });
    test('partner CANNOT skip straight to Completed', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Completed' })); });
    test('partner CANNOT reopen a Completed booking', async () => { const b = id(); await seed(b, { status: 'Completed' }); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Active' })); });
    test('partner CANNOT reopen a Cancelled booking', async () => { const b = id(); await seed(b, { status: 'Cancelled' }); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Requested' })); });
    test('partner CANNOT set an unknown status', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Paid' })); });
    test('partner CANNOT change other fields (scheduledAt)', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { scheduledAt: Timestamp.now() })); });
    test('partner whose approval was revoked cannot update status', async () => {
      const b = id(); await seed(b, { partnerId: 'quinn' });
      await env.withSecurityRulesDisabled((ctx) => updateDoc(doc(ctx.firestore(), 'partners/quinn'), { status: 'pending' }));
      await assertFails(updateDoc(doc(as('quinn'), `bookings/${b}`), { status: 'Active' }));
      await env.withSecurityRulesDisabled((ctx) => updateDoc(doc(ctx.firestore(), 'partners/quinn'), { status: 'approved' }));
    });
    test('updatedAt must be the server time', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { status: 'Active', updatedAt: WHEN })); });
    test('customer can cancel a Requested booking', async () => { const b = id(); await seed(b); await assertSucceeds(updateDoc(doc(as('alice'), `bookings/${b}`), { status: 'Cancelled' })); });
    test('customer can cancel an Active booking', async () => { const b = id(); await seed(b, { status: 'Active' }); await assertSucceeds(updateDoc(doc(as('alice'), `bookings/${b}`), { status: 'Cancelled' })); });
    test('customer CANNOT accept their own booking', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { status: 'Active' })); });
    test('customer CANNOT mark a booking Completed', async () => { const b = id(); await seed(b, { status: 'On the way' }); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { status: 'Completed' })); });
    test('customer CANNOT cancel once the partner is on the way', async () => { const b = id(); await seed(b, { status: 'On the way' }); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { status: 'Cancelled' })); });
    test('customer CANNOT reschedule (scheduledAt)', async () => { const b = id(); await seed(b); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { scheduledAt: Timestamp.now() })); });
  });

  describe('updating bookings: ratings', () => {
    test('customer can rate a Completed booking with a review', async () => {
      const b = id(); await seed(b, { status: 'Completed' });
      await assertSucceeds(updateDoc(doc(as('alice'), `bookings/${b}`), { rating: 5, review: 'Great work' }));
    });
    test('customer CANNOT change an existing rating', async () => {
      const b = id(); await seed(b, { status: 'Completed', rating: 2 });
      await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { rating: 5 }));
    });
    test('customer CANNOT rate a booking that is not Completed', async () => { const b = id(); await seed(b, { status: 'Active' }); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { rating: 5 })); });
    test('rating above 5 is rejected', async () => { const b = id(); await seed(b, { status: 'Completed' }); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { rating: 6 })); });
    test('rating below 1 is rejected', async () => { const b = id(); await seed(b, { status: 'Completed' }); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { rating: 0 })); });
    test('non-integer rating is rejected', async () => { const b = id(); await seed(b, { status: 'Completed' }); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { rating: 4.5 })); });
    test('customer CANNOT change status while rating', async () => { const b = id(); await seed(b, { status: 'Completed' }); await assertFails(updateDoc(doc(as('alice'), `bookings/${b}`), { rating: 5, status: 'Cancelled' })); });
    test('partner CANNOT rate their own job', async () => { const b = id(); await seed(b, { status: 'Completed' }); await assertFails(updateDoc(doc(as('pat'), `bookings/${b}`), { rating: 5 })); });
  });

  describe('deleting bookings is blocked', () => {
    test('customer cannot delete a booking', async () => { const b = id(); await seed(b); await assertFails(deleteDoc(doc(as('alice'), `bookings/${b}`))); });
    test('partner cannot delete a booking', async () => { const b = id(); await seed(b); await assertFails(deleteDoc(doc(as('pat'), `bookings/${b}`))); });
    test('outsider cannot delete a booking', async () => { const b = id(); await seed(b); await assertFails(deleteDoc(doc(as('eve'), `bookings/${b}`))); });
  });

  describe('chat: reading', () => {
    before(() => seed('chat1', {}, { m1: { senderId: 'alice', text: 'Hi' }, m2: { senderId: 'pat', text: 'On my way' } }));
    test('customer can list the chat', () => assertSucceeds(getDocs(collection(as('alice'), 'bookings/chat1/chat_messages'))));
    test('partner can read a message', () => assertSucceeds(getDoc(doc(as('pat'), 'bookings/chat1/chat_messages/m1'))));
    test('outsider CANNOT list the chat', () => assertFails(getDocs(collection(as('eve'), 'bookings/chat1/chat_messages'))));
    test('outsider CANNOT read a message', () => assertFails(getDoc(doc(as('eve'), 'bookings/chat1/chat_messages/m1'))));
    test('signed-out user CANNOT read the chat', () => assertFails(getDocs(collection(as(null), 'bookings/chat1/chat_messages'))));
    test('chat of a booking that does not exist is denied', () => assertFails(getDocs(collection(as('alice'), 'bookings/nope/chat_messages'))));
  });

  describe('chat: sending as yourself only', () => {
    before(() => seed('chat2'));
    test('customer can send a message as themselves', () => assertSucceeds(setDoc(doc(as('alice'), 'bookings/chat2/chat_messages/a1'), msg('alice'))));
    test('partner can send a message as themselves', () => assertSucceeds(setDoc(doc(as('pat'), 'bookings/chat2/chat_messages/p1'), msg('pat'))));
    test('customer CANNOT send a message as the partner', () => assertFails(setDoc(doc(as('alice'), 'bookings/chat2/chat_messages/f1'), msg('pat'))));
    test('partner CANNOT send a message as the customer', () => assertFails(setDoc(doc(as('pat'), 'bookings/chat2/chat_messages/f2'), msg('alice'))));
    test('message without senderId is rejected', () => {
      const { senderId, ...rest } = msg('alice');
      return assertFails(setDoc(doc(as('alice'), 'bookings/chat2/chat_messages/f3'), rest));
    });
    test('empty message is rejected', () => assertFails(setDoc(doc(as('alice'), 'bookings/chat2/chat_messages/f4'), msg('alice', { text: '' }))));
    test('message over 2000 characters is rejected', () => assertFails(setDoc(doc(as('alice'), 'bookings/chat2/chat_messages/f5'), msg('alice', { text: 'x'.repeat(2001) }))));
    test('message with extra fields is rejected', () => assertFails(setDoc(doc(as('alice'), 'bookings/chat2/chat_messages/f6'), msg('alice', { sender: 'partner' }))));
    test('message createdAt must be the server time', () => assertFails(setDoc(doc(as('alice'), 'bookings/chat2/chat_messages/f7'), msg('alice', { createdAt: WHEN }))));
    test('outsider CANNOT send a message', () => assertFails(setDoc(doc(as('eve'), 'bookings/chat2/chat_messages/e1'), msg('eve'))));
    test('signed-out user CANNOT send a message', () => assertFails(setDoc(doc(as(null), 'bookings/chat2/chat_messages/x1'), msg('alice'))));
    test('cannot post into a booking that does not exist', () => assertFails(setDoc(doc(as('alice'), 'bookings/nope/chat_messages/x2'), msg('alice'))));
  });

  describe('chat: messages cannot be edited or deleted', () => {
    before(() => seed('chat3', {}, { mA: { senderId: 'alice', text: 'Price is 500' }, mP: { senderId: 'pat', text: 'Agreed' } }));
    test("customer CANNOT edit the partner's message", () => assertFails(updateDoc(doc(as('alice'), 'bookings/chat3/chat_messages/mP'), { text: 'Price is 100' })));
    test("partner CANNOT delete the customer's message", () => assertFails(deleteDoc(doc(as('pat'), 'bookings/chat3/chat_messages/mA'))));
    test('author CANNOT edit their own message', () => assertFails(updateDoc(doc(as('alice'), 'bookings/chat3/chat_messages/mA'), { text: 'Price is 50' })));
    test('author CANNOT delete their own message', () => assertFails(deleteDoc(doc(as('alice'), 'bookings/chat3/chat_messages/mA'))));
    test('cannot overwrite an existing message with setDoc', () => assertFails(setDoc(doc(as('alice'), 'bookings/chat3/chat_messages/mP'), msg('alice'))));
  });

  describe('chat: closed when the booking is finished', () => {
    before(async () => {
      await seed('done1', { status: 'Completed' }, { m1: { senderId: 'pat', text: 'Done' } });
      await seed('gone1', { status: 'Cancelled' });
      await seed('road1', { status: 'On the way' });
    });
    test('cannot send on a Completed booking', () => assertFails(setDoc(doc(as('alice'), 'bookings/done1/chat_messages/x'), msg('alice'))));
    test('cannot send on a Cancelled booking', () => assertFails(setDoc(doc(as('pat'), 'bookings/gone1/chat_messages/x'), msg('pat'))));
    test('can still send while the partner is On the way', () => assertSucceeds(setDoc(doc(as('alice'), 'bookings/road1/chat_messages/x'), msg('alice'))));
    test('history of a Completed booking is still readable', () => assertSucceeds(getDocs(collection(as('alice'), 'bookings/done1/chat_messages'))));
  });
});
