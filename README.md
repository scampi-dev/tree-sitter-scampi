# tree-sitter-scampi

Tree-sitter grammar for [scampi](https://scampi.dev) configuration files (`.scampi`).

Extends [tree-sitter-starlark](https://github.com/tree-sitter-grammars/tree-sitter-starlark)
— same parser, different file extension. Queries are from upstream starlark.

## Neovim

### 1. Register the parser

Add the scampi entry to nvim-treesitter's parser list. In your plugin config:

```lua
-- inside nvim-treesitter opts
local parsers = require("nvim-treesitter.parsers")
parsers.scampi = {
  install_info = {
    url = "https://github.com/scampi-dev/tree-sitter-scampi",
    files = { "src/parser.c", "src/scanner.c" },
    branch = "main",
  },
  tier = 3,
}
```

### 2. Install parser and queries

The parser compiles via `:TSInstall scampi`, but nvim-treesitter does not
install queries for external parsers. Clone this repo and run:

```sh
just install
```

This compiles the parser and copies queries to the right location
(`~/.local/share/nvim/site/`). To remove:

```sh
just uninstall
```

### 3. Filetype and LSP

Add to your Neovim config:

```lua
vim.filetype.add({ extension = { scampi = "scampi" } })
vim.treesitter.language.register("scampi", "scampi")
```

For the LSP server (scampls), see the
[editor setup docs](https://scampi.dev/docs/lsp/).

## Helix

Add to `languages.toml`:

```toml
[[language]]
name = "scampi"
scope = "source.scampi"
file-types = ["scampi"]
roots = ["scampi.mod"]
comment-token = "#"
indent = { tab-width = 4, unit = "    " }

[[grammar]]
name = "scampi"
source = { git = "https://codeberg.org/scampi-dev/tree-sitter-scampi", rev = "main" }
```

Copy `upstream/*.scm` to your Helix runtime queries directory for highlighting.

## For maintainers

The `src/` directory is committed and consumed directly by editors.
To regenerate after changing `grammar.js`:

```sh
just generate   # regenerates src/ from grammar.js
just test       # parses example files to verify
```

Requires [just](https://just.systems) and Node.js.

## License

MIT — queries derived from [tree-sitter-starlark](https://github.com/tree-sitter-grammars/tree-sitter-starlark) (MIT).
