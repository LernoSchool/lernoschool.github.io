# LERNO v48

- Hide the header login/register button while an account session is active; restore it after logout.
- Keep the study back button visible above the page header, with its existing exit confirmation and timer resume/cancel behavior.
- Replace the mobile weekly table with six day tabs and six labelled periods for the selected day. Keep existing lesson editing and desktop rendering.
- Update asset versions and offline cache.

Validation: JavaScript syntax, local asset references, and a simulated DOM check of authentication visibility, day selection, existing lessons, period counts, study state and desktop fallback passed. The existing exit confirmation handler was inspected. Real-browser/device visual validation was unavailable; this release has not been deployed.
