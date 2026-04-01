# tree-sitter-scampi

Tree-sitter grammar for [scampi](https://scampi.dev) configuration files (`.scampi`).

Extends [tree-sitter-starlark](https://github.com/tree-sitter-grammars/tree-sitter-starlark)
— same parser, different file extension. Builtin highlighting is handled by
[scampls](https://scampi.dev/docs/lsp/) (the LSP server), not the grammar.

## Neovim

Register the parser and install:

```lua
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.scampi = {
  install_info = {
    url = "https://codeberg.org/scampi-dev/tree-sitter-scampi",
    files = { "src/parser.c", "src/scanner.c" },
    branch = "main",
  },
  filetype = "scampi",
}
```

Then `:TSInstall scampi`.

You'll also want the filetype and LSP — see the
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

## For maintainers

The `src/` directory is committed and consumed directly by editors.
To regenerate after changing `grammar.js`:

```sh
just generate   # regenerates src/ from grammar.js
just test       # parses example files to verify
```

Requires [just](https://just.systems) and Node.js.

## License

MIT
