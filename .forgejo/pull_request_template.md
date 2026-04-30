<!--
  Hi, and thanks for sending this!

  Pre-filling a few sections below to make review faster. Skip any that
  genuinely don't apply — "n/a" is a fine answer.
-->

## Summary

<!-- One or two sentences. What does this PR do, and why? -->

## Linked issue

<!--
  Use Forgejo magic keywords:
    closes #N   — non-bug change that resolves an issue
    fixes  #N   — bug fix that resolves an issue
    refs   #N   — related but doesn't close

  PRs without an issue tend to stall. If there isn't one, open it first.
-->

## Test plan

<!--
  How did you verify this works?
  Corpus tests under test/corpus/ are the standard for grammar changes;
  query changes can be verified by parsing the example files.
-->

## Checklist

- [ ] `just lint` passes (ESLint on `grammar.js`)
- [ ] `just test` passes (corpus + parse examples)
- [ ] `src/` regenerated from `grammar.js` (`just generate`) and committed
- [ ] If syntax change: corresponding scampi-side change is merged or
      linked
- [ ] Commit message follows the project convention
      (see [`CONTRIBUTING.md`](../CONTRIBUTING.md))
