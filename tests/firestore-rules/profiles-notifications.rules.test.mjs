// Firestore security rules: customer/partner profiles and notifications.
//
// Every rule is tested both ways: what must be allowed (assertSucceeds) and what must be denied (assertFails).
// Runs only against the local Firestore emulator under a "demo-" project id, so it can never
// reach the live Firebase project. Run with:  npm run test:rules
import { test, before, after, describe } from 'node:test';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const PROJECT = 'demo-wilayathub';
const RULES = fileURLToPath(new URL('../../firestore.rules', import.meta.url));

async function makeEnv() {
  // Host/port come from FIRESTORE_EMULATOR_HOST, which "firebase emulators:exec" sets.
  const env = await initializeTestEnvironment({ projectId: PROJECT, firestore: { rules: fs.readFileSync(RULES, 'utf8') } });
  await env.clearFirestore();
  // Seed: one notification owned by alice, written with rules disabled.
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'notifications/n1'), { userId: 'alice', text: 'Your booking is confirmed' });
    await setDoc(doc(ctx.firestore(), 'customers/alice'), { id: 'alice', name: 'Alice', role: 'customer' });
  });
  return env;
}

describe('profiles and notifications', () => {
  let env;
  before(async () => { env = await makeEnv(); });
  after(async () => { await env.cleanup(); });

  const as = (uid) => (uid ? env.authenticatedContext(uid) : env.unauthenticatedContext()).firestore();

  describe('notifications: ownership comes from the stored userId', () => {
    test('owner can read their notification', () => assertSucceeds(getDoc(doc(as('alice'), 'notifications/n1'))));
    test('another signed-in user CANNOT read it', () => assertFails(getDoc(doc(as('bob'), 'notifications/n1'))));
    test('signed-out user cannot read it', () => assertFails(getDoc(doc(as(null), 'notifications/n1'))));
    test('another user CANNOT update it', () => assertFails(updateDoc(doc(as('bob'), 'notifications/n1'), { text: 'hacked' })));
    test('another user CANNOT delete it', () => assertFails(deleteDoc(doc(as('bob'), 'notifications/n1'))));
    test('owner cannot reassign it to someone else', () => assertFails(updateDoc(doc(as('alice'), 'notifications/n1'), { userId: 'bob' })));
    test('owner can update the text', () => assertSucceeds(updateDoc(doc(as('alice'), 'notifications/n1'), { text: 'read' })));
    test('user can create a notification for themselves', () => assertSucceeds(setDoc(doc(as('bob'), 'notifications/n2'), { userId: 'bob', text: 'hi' })));
    test('user cannot create a notification for someone else', () => assertFails(setDoc(doc(as('bob'), 'notifications/n3'), { userId: 'alice', text: 'spam' })));
    test('listing notifications is denied', () => assertFails(getDocs(collection(as('alice'), 'notifications'))));
    test('owner can delete their notification', () => assertSucceeds(deleteDoc(doc(as('alice'), 'notifications/n1'))));
  });

  describe('profiles written by the new sign-up/login code', () => {
    const customer = (uid) => ({ id: uid, uid, email: `${uid}@example.com`, name: uid, role: 'customer' });
    const partner = (uid) => ({ ...customer(uid), role: 'partner', status: 'pending' });

    test('customer profile with id == uid is accepted', () => assertSucceeds(setDoc(doc(as('carol'), 'customers/carol'), customer('carol'))));
    test('partner profile with id == uid is accepted', () => assertSucceeds(setDoc(doc(as('dave'), 'partners/dave'), partner('dave'))));
    test('profile WITHOUT id (what the old Google flow wrote) is rejected', () => {
      const { id, ...withoutId } = customer('erin');
      return assertFails(setDoc(doc(as('erin'), 'customers/erin'), withoutId));
    });
    test("user cannot create someone else's profile", () => assertFails(setDoc(doc(as('bob'), 'customers/frank'), customer('frank'))));
    test("user cannot read someone else's profile", () => assertFails(getDoc(doc(as('bob'), 'customers/alice'))));
    test('user can read their own profile', () => assertSucceeds(getDoc(doc(as('alice'), 'customers/alice'))));
  });

  describe('partners: no self-approval, privileged fields locked', () => {
    const partner = (uid, extra = {}) => ({ id: uid, uid, email: `${uid}@example.com`, name: uid, role: 'partner', status: 'pending', ...extra });
    before(async () => {
      // Existing partners, written with admin privileges (as the Firebase console / Admin SDK would).
      await env.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), 'partners/paul'), partner('paul'));
        await setDoc(doc(ctx.firestore(), 'partners/apollo'), partner('apollo', { status: 'approved' }));
      });
    });

    test('create as approved is rejected', () => assertFails(setDoc(doc(as('p1'), 'partners/p1'), partner('p1', { status: 'approved' }))));
    test('create with any status other than pending is rejected', () => assertFails(setDoc(doc(as('p2'), 'partners/p2'), partner('p2', { status: 'verified' }))));
    test('create without a status is rejected', () => {
      const { status, ...noStatus } = partner('p3');
      return assertFails(setDoc(doc(as('p3'), 'partners/p3'), noStatus));
    });
    test('create with a non-partner role is rejected', () => assertFails(setDoc(doc(as('p4'), 'partners/p4'), partner('p4', { role: 'admin' }))));
    test('create with mismatched uid is rejected', () => assertFails(setDoc(doc(as('p5'), 'partners/p5'), partner('p5', { uid: 'someone-else' }))));
    test('create as pending partner is accepted', () => assertSucceeds(setDoc(doc(as('p6'), 'partners/p6'), partner('p6'))));

    test('pending partner cannot approve themselves', () => assertFails(updateDoc(doc(as('paul'), 'partners/paul'), { status: 'approved' })));
    test('partner cannot change role', () => assertFails(updateDoc(doc(as('paul'), 'partners/paul'), { role: 'admin' })));
    test('partner cannot change id', () => assertFails(updateDoc(doc(as('paul'), 'partners/paul'), { id: 'other' })));
    test('partner cannot change uid', () => assertFails(updateDoc(doc(as('paul'), 'partners/paul'), { uid: 'other' })));
    test('partner cannot remove status by overwriting the document', () => {
      const { status, ...noStatus } = partner('paul');
      return assertFails(setDoc(doc(as('paul'), 'partners/paul'), noStatus));
    });
    test('partner cannot self-approve via a full overwrite either', () => assertFails(setDoc(doc(as('paul'), 'partners/paul'), partner('paul', { status: 'approved' }))));
    test('partner CAN update ordinary profile fields', () => assertSucceeds(updateDoc(doc(as('paul'), 'partners/paul'), { name: 'Paul Plumbing', phone: '+91 90000 00000' })));
    test('approved partner can update ordinary fields', () => assertSucceeds(updateDoc(doc(as('apollo'), 'partners/apollo'), { name: 'Apollo Electricals' })));
    test('approved partner cannot change their own status either', () => assertFails(updateDoc(doc(as('apollo'), 'partners/apollo'), { status: 'pending' })));
    test("partner cannot edit another partner's profile", () => assertFails(updateDoc(doc(as('paul'), 'partners/apollo'), { name: 'x' })));

    // Deletion is admin-only, so a decision can't be wiped by delete + re-create.
    test('pending partner cannot delete their profile', () => assertFails(deleteDoc(doc(as('paul'), 'partners/paul'))));
    test('approved partner cannot delete their profile', () => assertFails(deleteDoc(doc(as('apollo'), 'partners/apollo'))));
    test('rejected partner cannot delete their profile (no reset to pending)', async () => {
      await env.withSecurityRulesDisabled((ctx) => setDoc(doc(ctx.firestore(), 'partners/rita'), partner('rita', { status: 'rejected' })));
      await assertFails(deleteDoc(doc(as('rita'), 'partners/rita')));
    });
    test('rejected partner cannot set themselves back to pending', () => assertFails(updateDoc(doc(as('rita'), 'partners/rita'), { status: 'pending' })));
    test('rejected partner cannot overwrite the profile as a fresh pending application', () => assertFails(setDoc(doc(as('rita'), 'partners/rita'), partner('rita'))));
  });

  describe('customers: role and identity fields locked', () => {
    const customer = (uid, extra = {}) => ({ id: uid, uid, email: `${uid}@example.com`, name: uid, role: 'customer', ...extra });
    before(async () => {
      await env.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), 'customers/cathy'), customer('cathy'));
      });
    });

    test('create with role partner is rejected', () => assertFails(setDoc(doc(as('c1'), 'customers/c1'), customer('c1', { role: 'partner' }))));
    test('create with role admin is rejected', () => assertFails(setDoc(doc(as('c2'), 'customers/c2'), customer('c2', { role: 'admin' }))));
    test('create without a role is rejected', () => {
      const { role, ...noRole } = customer('c3');
      return assertFails(setDoc(doc(as('c3'), 'customers/c3'), noRole));
    });
    test('create with mismatched uid is rejected', () => assertFails(setDoc(doc(as('c4'), 'customers/c4'), customer('c4', { uid: 'someone-else' }))));
    test('customer cannot change role', () => assertFails(updateDoc(doc(as('cathy'), 'customers/cathy'), { role: 'admin' })));
    test('customer cannot change id', () => assertFails(updateDoc(doc(as('cathy'), 'customers/cathy'), { id: 'other' })));
    test('customer cannot change uid', () => assertFails(updateDoc(doc(as('cathy'), 'customers/cathy'), { uid: 'other' })));
    test('customer CAN update ordinary profile fields', () => assertSucceeds(updateDoc(doc(as('cathy'), 'customers/cathy'), { name: 'Cathy D', phone: '+91 98888 00000' })));
    test('customer can still delete their own profile (unchanged)', () => assertSucceeds(deleteDoc(doc(as('cathy'), 'customers/cathy'))));
  });
});
