# Tech index

The tech page at `/tech` is the blog index: a hero with counts and the Now card, three Start here cards, the ledger of all posts grouped by theme, and theme chips that filter the ledger.

## Sub-features

- `tech-ledger` lists all 28 posts as `#ledger a.ledger-row`.
- `tech-start` shows three Start here cards.
- `tech-filter` narrows the ledger to 5 rows when the `Proof` chip is pressed.
- `tech-reduce` shows every heading at load with reduce motion on (the original live bug).

## How to get to it (user POV)

- Choose `Tech` in the header, or `Writing` in the footer.
- Open `/writing` or `/projects`; both redirect to `/tech`.

## Driving it with drive.mjs

Preconditions:

- `verify.sh doctor` prints `DOCTOR OK`.

- **Ledger.** Run `node .claude/skills/verify/scripts/drive.mjs tech`. The ledger has 28 rows.
- **Start here.** `.start .card` count is 3.
- **Filter.** Choose the `Proof` chip (`getByRole("button", { name: "Proof", exact: true })`). It has `aria-pressed="true"` and 5 ledger rows stay visible.
- **Reduce motion.** Nothing is invisible at load with reduce motion on.
- **Proof.** `tech-index-{1440,390}-{motion,reduce}.png` and `tech-ledger-proof-filter-{1440,390}-motion.png`.

## Gotchas

- A new post changes the counts (28 rows, 28 feed items). Update this file and the driver together.
- Theme labels are sticky at desktop only.
