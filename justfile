scanner_src := "./node_modules/tree-sitter-python/src/scanner.c"

[default]
[doc("Show this help message")]
@help:
  just --unsorted --list

[doc("Install npm dependencies (skips if already installed)")]
setup:
  @[ -x node_modules/tree-sitter-cli/tree-sitter ] || { npm install --ignore-scripts && cd node_modules/tree-sitter-cli && node install.js; }

[doc("Generate parser from grammar.js and patch the scanner")]
generate: setup
  npx tree-sitter generate
  @echo "Patching scanner symbols (python → scampi)..."
  sed 's/tree_sitter_python/tree_sitter_scampi/g' {{scanner_src}} > src/scanner.c
  @echo "Done. src/ is ready to commit."

[doc("Compile parser .so and install into Neovim")]
install:
  cc -shared -o scampi.so -fPIC -I src src/parser.c src/scanner.c
  mkdir -p ~/.local/share/nvim/site/parser
  mkdir -p ~/.local/share/nvim/site/queries/scampi
  cp scampi.so ~/.local/share/nvim/site/parser/scampi.so
  cp queries/*.scm ~/.local/share/nvim/site/queries/scampi/
  rm scampi.so
  @echo "Installed. Restart Neovim."

[doc("Remove parser and queries from Neovim")]
uninstall:
  rm -f ~/.local/share/nvim/site/parser/scampi.so
  rm -rf ~/.local/share/nvim/site/queries/scampi
  @echo "Uninstalled. Restart Neovim."

[doc("Parse example files to verify the grammar")]
test: generate
  npx tree-sitter parse examples/*.scampi

[doc("Remove all generated and installed files")]
clean:
  rm -rf src/ bindings/ build/ node_modules/ package-lock.json
