# Security Specification: HIM Law Office

## 1. Data Invariants
- **Reservations**: Any client can create a reservation (public create). Reading a specific reservation ID or editing/updating its state or internal notes is strictly limited to authenticated Admin roles.
- **Settings**: Modifying global configurations like the lawyer's photo is strictly restricted to authenticated Admin roles. Public users can read settings to build the UI with the designated portrait image.
- **Admin Authentication**: Standard auth identifiers or emails must not bypass rule security without robust validation. Authenticated administrators must be verified against an explicit admins collection lookup.

## 2. The "Dirty Dozen" Payloads (Malicious Attempts)
1. **Malicious Reservation Read**: Authenticated non-admin user attempts to read another client's reservation details.
2. **Malicious Reservation Update**: Authenticated non-admin attempts to update a reservation status to "confirmed" or edit lawyer notes.
3. **Malicious Settings Overwrite**: Authenticated non-admin attempts to replace the lawyer's portrait URL with an offensive link.
4. **Unauthenticated Write**: Anonymous visitor trying to delete a reservation document.
5. **Junk Field Pollution**: An attacker attempts to inject a huge 1MB "ghost_field" into setting configurations (denial of wallet/resource poisoning).
6. **Malicious ID Injection**: Setting a reservation path with a 10KB special character ID variable.
7. **Temporal Spoofing**: Client sending a fake `createdAt` timestamp backward in time instead of server timestamp `request.time`.
8. **Self-Promotion Hook**: Authenticated user trying to create an admin record in the `/admins/` collection relative to their own UID.
9. **Status Modification without validation**: Modifying status to a random invalid state string like `'hack_state'`.
10. **Blanket Query Collection Read**: Standard non-admin client querying the entire `/reservations` collection.
11. **Immortal Keys Mutability**: Admin/user trying to change the `createdAt` timestamp of an existing reservation.
12. **Null User Email Spoofing**: Attack on admin rules by supplying a token where `email_verified` is false but matching the administrator email address.

## 3. Test Verification Rules
All "Dirty Dozen" payloads above must return `PERMISSION_DENIED` or be successfully blocked at the security rule layer.
