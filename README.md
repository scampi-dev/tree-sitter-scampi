# tree-sitter-scampi

Tree-sitter grammar for [scampi](https://scampi.dev) configuration files (`.scampi`).

Extends [tree-sitter-starlark](https://github.com/tree-sitter-grammars/tree-sitter-starlark)
— same parser, different file extension. Queries inherit from starlark.

## Neovim (nvim-treesitter)

Add to your Neovim config:

```lua
-- Register the scampi parser (not yet upstream in nvim-treesitter)
vim.api.nvim_create_autocmd("User", {
  pattern = "TSUpdate",
  callback = function()
    require("nvim-treesitter.parsers").scampi = {
      install_info = {
        url = "https://github.com/scampi-dev/tree-sitter-scampi",
        revision = "v0.1.0",
        queries = "queries",
      },
      requires = { "starlark" },
    }
  end,
})

-- Register filetype and language
vim.filetype.add({ extension = { scampi = "scampi" } })
vim.treesitter.language.register("scampi", "scampi")
```

Add `"scampi"` to your `ensure_installed` list in nvim-treesitter opts.
The parser and its starlark dependency install automatically.

For the LSP server (scampls), see the
[editor setup docs](https://scampi.dev/docs/lsp/).

## Manual install

If nvim-treesitter doesn't work for your setup, clone this repo and run:

```sh
just install    # compiles parser .so + copies queries into Neovim
just uninstall  # removes both
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

MIT — queries derived from [tree-sitter-starlark](https://github.com/tree-sitter-grammars/tree-sitter-starlark) (MIT).
