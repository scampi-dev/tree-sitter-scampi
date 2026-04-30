# Contributing to tree-sitter-scampi

Hi, and thanks for considering a contribution!

This is the [Tree-sitter](https://tree-sitter.github.io/) grammar for
[scampi](https://codeberg.org/scampi-dev/scampi) configuration files
(`.scampi`). It powers syntax highlighting, folds, indents, and more
in editors that support tree-sitter (Neovim, Helix, Emacs, ...).

## Where things live

This repo is on
**[Codeberg](https://codeberg.org/scampi-dev/tree-sitter-scampi)**.
The GitHub repository is a read-only mirror — issues and pull requests
filed there will be auto-closed with a redirect.

[Codeberg sign-up](https://codeberg.org/user/sign_up) is free, no
email confirmation needed.

## Filing issues

Issue templates pre-fill the right labels and prompts:

- **Bug** — the parser fails on valid scampi, or produces a wrong
  tree shape
- **Feature** — query updates (highlights, folds, indents) or
  grammar tweaks

The grammar tracks
[scampi the language](https://codeberg.org/scampi-dev/scampi/src/branch/main/lang) —
no extra syntax beyond what scampi accepts.

## Pull requests

Grammar PRs must:

- **Include corpus tests** under `test/corpus/` covering the new or
  fixed syntax. `just test` runs the suite.
- **Successfully parse the example files** under `examples/`.
- **Regenerate `src/`** before committing (`just generate`) — the
  generated parser is committed so editors can consume it directly.
- **Pass `just lint`** on `grammar.js`.

## Building and testing

```bash
just setup       # one-time: install npm deps + tree-sitter config
just generate    # regenerate src/ from grammar.js
just lint        # ESLint on grammar.js
just test        # corpus tests + parse examples
```

You'll need [Node.js](https://nodejs.org), [`just`](https://github.com/casey/just),
and the [tree-sitter CLI](https://tree-sitter.github.io/tree-sitter/cli) on your `PATH`.

## Project-wide conventions

Commit messages and broader contributor expectations live in
[scampi's `CONTRIBUTING.md`](https://codeberg.org/scampi-dev/scampi/src/branch/main/CONTRIBUTING.md).
This repo follows them.

## A note on grammar scope

The grammar tracks scampi the language. Things that won't land:

- **Syntax that scampi doesn't actually accept.** Grammar is a
  consumer of the scampi spec, not a place to invent new syntax.
- **Embedded language injections** beyond what's already there
  (string interpolation, etc.).
- **External scanner state machines.** This grammar is intentionally
  scanner-free for portability.

If scampi the language gains new syntax, this repo follows. If you're
proposing grammar changes ahead of scampi, file the issue on
[scampi](https://codeberg.org/scampi-dev/scampi) first.

## Thank you

File the issue, send the PR, ask the question. Even a "this idea
doesn't fit, here's why" is useful information for both of us.
