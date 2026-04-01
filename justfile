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

[doc("Parse example files to verify the grammar")]
test: generate
  npx tree-sitter parse examples/*.scampi

[doc("Remove all generated and installed files")]
clean:
  rm -rf src/ bindings/ build/ node_modules/ package-lock.json
