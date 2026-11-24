# Firebase Studio

This is a NextJS starter in Firebase Studio.

To get started, take a look at src/app/page.tsx.

## Testing

### Firestore security rules

`firestore.rules` is covered by tests in `tests/firestore-rules/`. They check every rule both ways: what must be allowed and what must be denied.

- `profiles-notifications.rules.test.mjs`: customer and partner profiles (no self-approval, locked identity fields) and notification ownership
- `bookings-chat.rules.test.mjs`: bookings (customers only, approved partners only, immutable participants, status and rating changes by role, no deletion) and chat messages (participants only, sent as yourself, no editing or deleting, closed once a booking is finished)

Run them with:

```bash
npm run test:rules
```

This starts the local Firestore emulator, runs the tests with Node's built-in test runner, and stops the emulator. The tests use the `demo-wilayathub` project ID, so they never touch the live Firebase project or its data.

Requirements:

- Node.js 20 or newer
- Java 17 or newer (the Firestore emulator runs on Java). The pinned `firebase-tools` 13.35.1 supports Java 17; newer `firebase-tools` versions need Java 21.

Windows note: if a run fails with "port taken" on 8080, a Firestore emulator from an earlier run may still be running. Stop the leftover `java` process whose command line contains `cloud-firestore-emulator`.

### Running the app against the emulators

Set `NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true` (see `.env.example`) to make the app use the local Auth (port 9099) and Firestore (port 8080) emulators instead of the real project.
