/**
 * @file Scampi grammar for tree-sitter
 * @license MIT
 * @see {@link https://scampi.dev|official website}
 * @see {@link https://codeberg.org/scampi-dev/scampi|source repository}
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const Starlark = require('tree-sitter-starlark/grammar');

module.exports = grammar(Starlark, {
  name: 'scampi',

  rules: {},
});
