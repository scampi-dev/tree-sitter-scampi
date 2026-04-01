[default]
[doc("Show this help message")]
@help:
  just --unsorted --list

[doc("Install npm dependencies and tree-sitter config")]
setup:
  @[ -x node_modules/tree-sitter-cli/tree-sitter ] || { npm install --ignore-scripts && cd node_modules/tree-sitter-cli && node install.js; }
  @[ -f ~/.config/tree-sitter/config.json ] || npx tree-sitter init-config

[doc("Generate parser from grammar.js")]
generate: setup
  npx tree-sitter generate
  @echo "Done. src/ is ready to commit."

[doc("Run ESLint on grammar.js")]
lint: setup
  npx eslint grammar.js

[doc("Run all tests (corpus + examples)")]
test: generate
  npx tree-sitter test
  npx tree-sitter parse -p . examples/*.scampi

[doc("Run only corpus tests")]
test-corpus: generate
  npx tree-sitter test

[doc("Parse example files")]
test-parse: generate
  npx tree-sitter parse -p . examples/*.scampi

[doc("Remove all generated and installed files")]
clean:
  rm -rf src/ bindings/ build/ node_modules/ package-lock.json
