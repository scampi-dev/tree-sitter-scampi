/**
 * @file Scampi-lang grammar for tree-sitter
 * @license MIT
 * @see {@link https://scampi.dev|official website}
 * @see {@link https://codeberg.org/scampi-dev/scampi|source repository}
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: 'scampi',

  extras: $ => [/\s/, $.comment],

  word: $ => $.identifier,

  conflicts: $ => [
    // The inner expression in an if_expression looks like an expression_statement.
    [$.expression_statement, $.if_expression],
    // `{ ident =` can start struct_literal or map_literal at expression position.
    [$._anon_struct_literal, $.map_literal],
    // `identifier {` could be expression + block or dotted_name for struct_literal.
    [$._expression, $.dotted_name],
    // if/for conditions use _non_struct_expression; identifier could start dotted_name.
    [$._non_struct_expression, $.dotted_name],
  ],

  supertypes: $ => [
    $._expression,
    $._statement,
    $._declaration,
    $._type_expression,
  ],

  rules: {
    source_file: $ => seq(
      optional($.module_declaration),
      repeat($._top_level_item),
    ),

    _top_level_item: $ => choice(
      $.import_declaration,
      $._declaration,
      $._statement,
    ),

    // ---------------------------------------------------------------
    // Comments
    // ---------------------------------------------------------------
    //
    // Line comments:  // ...
    // Block comments: /* ... */
    //
    // Note: tree-sitter regex cannot express nested block comments.
    // The lang lexer handles nesting correctly; the grammar here uses
    // the classic non-nesting C block comment pattern, which is fine
    // for highlighting in 99% of cases. A user nesting block comments
    // will see the inner */ visually close the outer block in the
    // editor, but the file still parses correctly via the real lexer.

    comment: _ => token(choice(
      seq('//', /.*/),
      seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'),
    )),

    // ---------------------------------------------------------------
    // Declarations
    // ---------------------------------------------------------------

    _declaration: $ => choice(
      $.type_declaration,
      $.attribute_type_declaration,
      $.enum_declaration,
      $.func_declaration,
      $.decl_declaration,
      $.let_declaration,
    ),

    module_declaration: $ => seq('module', $.identifier),

    import_declaration: $ => seq('import', $.string),

    type_declaration: $ => prec.right(seq(
      'type',
      $.identifier,
      optional($.type_body),
    )),

    // Attribute type declaration: `type @name { fields }`. Lives in
    // a separate `@`-prefixed namespace from regular types and is
    // consumed only as `@name(args)` decorations on annotatable
    // positions. Markers have an empty body: `type @marker {}`.
    attribute_type_declaration: $ => seq(
      'type',
      '@',
      $.identifier,
      $.attribute_type_body,
    ),

    attribute_type_body: $ => seq(
      '{',
      sepTrailing($.field_definition),
      '}',
    ),

    type_body: $ => seq(
      '{',
      sepTrailing($.field_definition),
      '}',
    ),

    enum_declaration: $ => seq(
      'enum',
      $.identifier,
      '{',
      sepTrailing($.identifier),
      '}',
    ),

    func_declaration: $ => prec.right(seq(
      'func',
      $.identifier,
      $.parameter_list,
      optional($._type_expression),
      optional($.block),
    )),

    decl_declaration: $ => prec.right(seq(
      'decl',
      $.dotted_name,
      $.parameter_list,
      optional($._type_expression),
      optional($.block),
    )),

    let_declaration: $ => seq(
      'let',
      $.identifier,
      optional(seq(':', $._type_expression)),
      '=',
      $._expression,
    ),

    // ---------------------------------------------------------------
    // Parameters and Fields
    // ---------------------------------------------------------------

    parameter_list: $ => seq(
      '(',
      commaSepTrailing($.field_definition),
      ')',
    ),

    field_definition: $ => seq(
      repeat($.attribute),
      $.identifier,
      ':',
      $._type_expression,
      optional(seq('=', $._expression)),
    ),

    // Attribute: prefix annotation on a Field, e.g. `@nonempty`,
    // `@since("0.5")`, `@path(absolute=true, on=remote)`. Resolves
    // through the `@`-namespaced scope to an `attribute_type_declaration`.
    attribute: $ => seq(
      '@',
      $.dotted_name,
      optional($.attribute_arguments),
    ),

    attribute_arguments: $ => seq(
      '(',
      commaSepTrailing(choice(
        $.attribute_named_argument,
        $._expression,
      )),
      ')',
    ),

    attribute_named_argument: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', $._expression),
    ),

    // ---------------------------------------------------------------
    // Type Expressions
    // ---------------------------------------------------------------

    _type_expression: $ => choice(
      $.named_type,
      $.generic_type,
      $.optional_type,
    ),

    named_type: $ => $.dotted_name,

    generic_type: $ => prec(1, seq(
      $.identifier,
      '[',
      commaSep1($._type_expression),
      ']',
    )),

    optional_type: $ => seq(
      choice($.named_type, $.generic_type),
      '?',
    ),

    // ---------------------------------------------------------------
    // Statements
    // ---------------------------------------------------------------

    _statement: $ => choice(
      $.expression_statement,
      $.for_statement,
      $.if_statement,
      $.return_statement,
      $.assignment_statement,
    ),

    expression_statement: $ => $._expression,

    for_statement: $ => seq(
      'for',
      $.identifier,
      'in',
      $._non_struct_expression,
      $.block,
    ),

    if_statement: $ => prec.right(seq(
      'if',
      $._non_struct_expression,
      $.block,
      optional($.else_clause),
    )),

    else_clause: $ => seq(
      'else',
      choice($.block, $.if_statement),
    ),

    return_statement: $ => prec.right(seq(
      'return',
      optional($._expression),
    )),

    assignment_statement: $ => seq(
      choice($.index_expression, $.selector_expression),
      '=',
      $._expression,
    ),

    block: $ => seq(
      '{',
      repeat(choice($._declaration, $._statement)),
      '}',
    ),

    // ---------------------------------------------------------------
    // Expressions
    // ---------------------------------------------------------------

    // Expression variant that excludes brace-initiated forms.
    // Used in if/for conditions where `{` always starts the block body.
    _non_struct_expression: $ => choice(
      $.identifier,
      $.integer,
      $.string,
      $.true,
      $.false,
      $.none,
      $.self,
      $.list_literal,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.selector_expression,
      $.index_expression,
      $.parenthesized_expression,
      $.list_comprehension,
    ),

    _expression: $ => choice(
      $.identifier,
      $.integer,
      $.string,
      $.true,
      $.false,
      $.none,
      $.self,
      $.list_literal,
      $.map_literal,
      $.struct_literal,
      $.binary_expression,
      $.unary_expression,
      $.call_expression,
      $.selector_expression,
      $.index_expression,
      $.block_expression,
      $.parenthesized_expression,
      $.if_expression,
      $.list_comprehension,
      $.map_comprehension,
    ),

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    binary_expression: $ => {
      const table = [
        [1, '||'],
        [2, '&&'],
        [3, choice('==', '!=', '<', '>', '<=', '>=')],
        [4, 'in'],
        [5, choice('+', '-')],
        [6, choice('*', '/', '%')],
      ];
      return choice(...table.map(([precedence, operator]) =>
        prec.left(/** @type {number} */ (precedence), seq(
          field('left', $._expression),
          field('operator', operator),
          field('right', $._expression),
        )),
      ));
    },

    unary_expression: $ => prec(7, seq(
      field('operator', choice('!', '-')),
      field('operand', $._expression),
    )),

    call_expression: $ => prec(8, seq(
      field('function', $._expression),
      $.argument_list,
    )),

    argument_list: $ => seq(
      '(',
      commaSepTrailing(choice($.keyword_argument, $._expression)),
      ')',
    ),

    keyword_argument: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', $._expression),
    ),

    selector_expression: $ => prec(8, seq(
      field('object', $._expression),
      '.',
      field('field', $.identifier),
    )),

    index_expression: $ => prec(8, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
      ']',
    )),

    block_expression: $ => prec(8, seq(
      field('target', $.call_expression),
      $.block,
    )),

    // struct_literal has two forms:
    //   typed: TypeName { field = val, ... }
    //   anon:  { field = val, ... }
    //
    // The typed form uses prec.dynamic to win against the alternative
    // parse where `TypeName` becomes a selector_expression and `{ ... }`
    // a new anonymous struct_literal in a separate expression_statement.
    // Without dynamic precedence, the parser flip-flops based on whether
    // a comment (or other extras token) sits between TypeName and `{`.
    struct_literal: $ => choice(
      $._typed_struct_literal,
      $._anon_struct_literal,
    ),

    _typed_struct_literal: $ => prec.dynamic(1, seq(
      field('type', $.dotted_name),
      '{',
      sepTrailing(choice($.field_initializer, $._statement, $._declaration)),
      '}',
    )),

    _anon_struct_literal: $ => seq(
      '{',
      sepTrailing(choice($.field_initializer, $._statement, $._declaration)),
      '}',
    ),

    field_initializer: $ => seq(
      field('name', $.identifier),
      '=',
      field('value', $._expression),
    ),

    if_expression: $ => prec.right(seq(
      'if',
      field('condition', $._non_struct_expression),
      '{',
      field('consequence', $._expression),
      '}',
      'else',
      '{',
      field('alternative', $._expression),
      '}',
    )),

    list_comprehension: $ => seq(
      '[',
      field('body', $._expression),
      'for',
      field('variable', $.identifier),
      'in',
      field('iterable', $._expression),
      optional(seq('if', field('condition', $._expression))),
      ']',
    ),

    map_comprehension: $ => seq(
      '{',
      field('key', $._expression),
      ':',
      field('value', $._expression),
      'for',
      commaSep1(field('variable', $.identifier)),
      'in',
      field('iterable', $._expression),
      optional(seq('if', field('condition', $._expression))),
      '}',
    ),

    // ---------------------------------------------------------------
    // Literals
    // ---------------------------------------------------------------

    list_literal: $ => seq(
      '[',
      commaSepTrailing($._expression),
      ']',
    ),

    map_literal: $ => seq(
      '{',
      commaSepTrailing($.map_entry),
      '}',
    ),

    map_entry: $ => seq(
      field('key', $._expression),
      ':',
      field('value', $._expression),
    ),

    integer: _ => token(choice(
      /[0-9]+/,
      /0[xX][0-9a-fA-F]+/,
      /0[bB][01]+/,
      /0[oO][0-7]+/,
    )),

    true: _ => 'true',
    false: _ => 'false',
    none: _ => 'none',
    self: _ => 'self',

    // ---------------------------------------------------------------
    // Strings with interpolation
    // ---------------------------------------------------------------

    string: $ => seq(
      '"',
      repeat(choice(
        $.string_content,
        $.escape_sequence,
        $.interpolation,
        $._dollar_literal,
      )),
      '"',
    ),

    string_content: _ => token.immediate(prec(1, /[^"\\$]+/)),

    // A literal `$` inside a string. Tree-sitter prefers the longer
    // `${` interpolation token (also token.immediate) over this one
    // when both could match, so interpolation still wins. The shorter
    // form fires only when the `$` is not followed by `{` — letting
    // strings like `"^[0-9]+$"` parse without eating the closing
    // quote.
    _dollar_literal: _ => token.immediate('$'),

    escape_sequence: _ => token.immediate(seq(
      '\\',
      choice('n', 't', 'r', '\\', '"', '$', '0'),
    )),

    interpolation: $ => seq(
      token.immediate('${'),
      $._expression,
      '}',
    ),

    // ---------------------------------------------------------------
    // Identifiers
    // ---------------------------------------------------------------

    identifier: _ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    dotted_name: $ => prec.left(seq(
      $.identifier,
      repeat(seq('.', $.identifier)),
    )),
  },
});

/**
 * Creates a comma-separated list with optional trailing comma.
 *
 * @param {RuleOrLiteral} rule
 * @returns {SeqRule}
 */
function commaSepTrailing(rule) {
  return seq(
    repeat(seq(rule, ',')),
    optional(rule),
  );
}

/**
 * Creates a list where items are separated by optional commas (newlines suffice).
 *
 * @param {RuleOrLiteral} rule
 * @returns {RepeatRule}
 */
function sepTrailing(rule) {
  return repeat(seq(rule, optional(',')));
}

/**
 * Creates a comma-separated list with at least one element.
 *
 * @param {RuleOrLiteral} rule
 * @returns {SeqRule}
 */
function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}
