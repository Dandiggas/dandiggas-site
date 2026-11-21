# Email form

The Buttondown email sign-up shows "coming soon" until `NEXT_PUBLIC_BUTTONDOWN_USERNAME` is set at build time. In that placeholder state the input and the `Get the next post` button are disabled, and the note points to the RSS feed. It appears in the Now card on `/tech` (`#subscribe`), in the keep-up box on each post, and in the keep-up band on `/now`.

## Sub-features

- `email-coming-soon` shows `data-state="coming-soon"` with the input and button disabled.
- `email-note` says "Email sign-up opens soon" and links `RSS feed` to `/feed.xml`.
- `email-no-send` sends nothing and does not navigate when the reader clicks the disabled button.
- `email-reduce` shows the form at load without scrolling under reduce motion.

## How to get to it (user POV)

- Choose `Email, one per post` in the footer; it goes to `/tech#subscribe`.
- Scroll to the keep-up box at the end of any post.
- Scroll to the bottom of `/now`.

## Driving it with drive.mjs

Preconditions:

- `verify.sh doctor` prints `DOCTOR OK`, including `email form is in coming-soon (placeholder) state`.

- **State.** Run `node .claude/skills/verify/scripts/drive.mjs email`. On `/tech`, the post and `/now`, the form has `data-state="coming-soon"`, a disabled email input and a disabled `Get the next post` button.
- **Note.** The note contains `Email sign-up opens soon` and the `RSS feed` link goes to `/feed.xml`.
- **No send.** Force-click the disabled button. No request goes to Buttondown and the URL does not change.
- **Proof.** `email-coming-soon-{tech,post,now}-{1440,390}-{motion,reduce}.png`.

## Gotchas

- Never build with a real username, create a Buttondown account or subscribe from this skill.
- The ready and sent states need a build with a username. `npm run test:e2e` covers them on port 3457 with `example` and a local stub.
- A local `.env` that sets a username would flip the state. `verify.sh launch` forces it empty.
