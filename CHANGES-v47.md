# LERNO v47

- Replaced v46 inline dropdowns with one app-owned, searchable dialog with checked selection cards.
- Icon-only blue chevron buttons; no native select is exposed to pointer or keyboard interaction.
- Custom subject names can be entered and are retained locally.
- Replaced deadline dropdowns with a Persian month grid, month navigation, today/tomorrow shortcuts and selected-day state.
- Fixed confirmation button row geometry, including legacy data-yes margin.
- Limited homework submit button to 180 × 50 CSS pixels.
- Separated todo title/priority and date/time rows.
- Limited settings switches to 46 × 26 CSS pixels with a centered 20-pixel thumb.
- Desktop no longer displays the mobile close button as a white bar. Mobile keeps its compact close control.
- Removed delayed clock selection update and corrected wheel row sizing.
- Updated offline cache and asset versions.

Validation: JavaScript syntax, asset existence, stylesheet block balance and archive integrity checked.
Not verified: visual rendering and end-to-end interaction in a real browser. The available cloud browser blocked local preview access; no workaround was attempted.
This archive updates the frontend only. It does not deploy to the live domain or add online authentication/chat.
