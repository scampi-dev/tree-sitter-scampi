# tree-sitter-scampi

> [!NOTE]
> Part of the [scampi](https://scampi.dev) project. Development happens on [Codeberg](https://codeberg.org/scampi-dev/tree-sitter-scampi) — please file issues and pull requests there. The GitHub mirror exists for `:TSInstall` compatibility.

Tree-sitter grammar for [scampi](https://scampi.dev) configuration files (`.scampi`).

Standalone grammar — no external scanner, no dependencies on other parsers.

## Neovim

Not yet upstream in nvim-treesitter. Register the parser manually:

```lua
vim.filetype.add({ extension = { scampi = "scampi" } })

vim.api.nvim_create_autocmd("User", {
  pattern = "TSUpdate",
  callback = function()
    require("nvim-treesitter.parsers").scampi = {
      install_info = {
        url = "https://github.com/scampi-dev/tree-sitter-scampi",
      },
    }
  end,
})
```

Then run `:TSInstall scampi`.

Alternatively, use the [pskry/nvim-treesitter](https://github.com/pskry/nvim-treesitter/tree/add-scampi-parser) fork which has scampi pre-registered.

For the LSP server (scampls), see the [editor setup docs](https://scampi.dev/docs/lsp/).

## Development

The `src/` directory is committed and consumed directly by editors.
To regenerate after changing `grammar.js`:

```sh
just setup      # install deps + tree-sitter config
just generate   # regenerate src/ from grammar.js
just test       # corpus tests + parse examples
just lint       # eslint on grammar.js
```

Requires [just](https://just.systems) and Node.js.

## License

MIT
