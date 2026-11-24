'use client';

import { signOut, type Auth, type User } from 'firebase/auth';
import { doc, getDoc, setDoc, type Firestore } from 'firebase/firestore';

export type AccountType = 'customer' | 'partner';

// Set while the user is deliberately logging out, so AuthGuard sends them to a plain
// /login instead of /login?next=<page they were on> (which is meant for expired sessions).
let intentionalSignOut = false;

/** Log out on purpose (e.g. the Logout button). */
export async function signOutUser(auth: Auth): Promise<void> {
  intentionalSignOut = true;
  try {
    await signOut(auth);
  } catch (error) {
    intentionalSignOut = false;
    throw error;
  }
}

/** Returns true once after signOutUser(), then resets. Used by AuthGuard. */
export function consumeIntentionalSignOut(): boolean {
  const value = intentionalSignOut;
  intentionalSignOut = false;
  return value;
}

/**
 * Make sure the signed-in user has a profile document for the flow they used
 * (customers/{uid} or partners/{uid}) and return where to send them next.
 *
 * Used by email sign-up, email login and Google sign-in so all three behave the same.
 * The documents include `id: uid` because firestore.rules only allows a create when
 * request.resource.data.id matches the document id.
 */
export async function ensureProfileAndGetDestination(
  firestore: Firestore,
  user: User,
  accountType: AccountType,
  displayName?: string | null,
): Promise<string> {
  const name = displayName ?? user.displayName ?? null;

  if (accountType === 'partner') {
    const ref = doc(firestore, 'partners', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        id: user.uid,
        uid: user.uid,
        email: user.email,
        name,
        role: 'partner',
        status: 'pending',
      });
      return '/partner/onboarding';
    }
    return snap.data().status === 'approved' ? '/partner/dashboard' : '/partner/verification';
  }

  const ref = doc(firestore, 'customers', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      id: user.uid,
      uid: user.uid,
      email: user.email,
      name,
      role: 'customer',
    });
  }
  return '/dashboard';
}

const MAX_DECODE_ROUNDS = 5;
// Backslashes (browsers treat "/\" like "//") and ASCII control characters (tab/newline are stripped by URL parsers).
const UNSAFE_CHARS = /[\\\u0000-\u001f\u007f]/;

/**
 * Only allow redirects to paths inside this app (prevents open redirects via ?next=).
 *
 * The value is decoded repeatedly so encoded tricks such as "/%5Cevil.com" or
 * "/%255Cevil.com" are inspected in every form; any backslash, control character
 * or protocol-relative "//" at any decoding level is rejected. Finally the path is
 * resolved against a placeholder origin and must still belong to that origin.
 */
export function safeNextPath(next: string | null): string | null {
  if (!next) return null;

  // Collect every decoding level: next, decode(next), decode(decode(next)), ...
  const forms = [next];
  let current = next;
  let stable = false;
  for (let round = 0; round <= MAX_DECODE_ROUNDS; round++) {
    let decoded: string;
    try {
      decoded = decodeURIComponent(current);
    } catch {
      return null; // malformed percent-encoding
    }
    if (decoded === current) {
      stable = true;
      break;
    }
    forms.push(decoded);
    current = decoded;
  }
  if (!stable) return null; // still changing after MAX_DECODE_ROUNDS: suspiciously deep encoding

  for (const form of forms) {
    if (!form.startsWith('/') || form.startsWith('//') || UNSAFE_CHARS.test(form)) return null;
  }

  const base = 'https://app.invalid';
  let url: URL;
  try {
    url = new URL(next, base);
  } catch {
    return null;
  }
  if (url.origin !== base) return null;
  if (url.pathname === '/login' || url.pathname.startsWith('/login/')) return null;
  return url.pathname + url.search + url.hash;
}
