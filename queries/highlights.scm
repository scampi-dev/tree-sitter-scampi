; Keywords
[
  "module"
  "import"
  "let"
  "type"
  "enum"
  "decl"
] @keyword

[
  "func"
] @keyword.function

[
  "return"
] @keyword.return

[
  "if"
  "else"
] @conditional

[
  "for"
  "in"
] @repeat

; Literals
(true) @boolean
(false) @boolean
(none) @constant.builtin
(self) @variable.builtin
(integer) @number
(string) @string
(escape_sequence) @string.escape
(interpolation
  "${" @punctuation.special
  "}" @punctuation.special)
(comment) @comment @spell

; Declarations
(module_declaration
  (identifier) @module)

(import_declaration
  (string) @string.special)

(type_declaration
  (identifier) @type.definition)

(attribute_type_declaration
  "@" @attribute
  (identifier) @attribute)

(enum_declaration
  (identifier) @type.definition)

(func_declaration
  (identifier) @function)

(decl_declaration
  (dotted_name) @function)

(let_declaration
  (identifier) @variable)

; Attributes (prefix annotations on field definitions)
(attribute
  "@" @attribute
  (dotted_name
    (identifier) @attribute))

(attribute_named_argument
  name: (identifier) @property)

; Fields and parameters
(field_definition
  (identifier) @property)

(field_initializer
  name: (identifier) @property)

(keyword_argument
  name: (identifier) @property)

; Type expressions
(named_type
  (dotted_name
    (identifier) @type))

(generic_type
  (identifier) @type)

(optional_type
  "?" @punctuation.special)

; Expressions
(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (selector_expression
    field: (identifier) @method.call))

(selector_expression
  field: (identifier) @property)

; Builtin function calls
((call_expression
  function: (identifier) @function.builtin)
 (#any-of? @function.builtin "len" "int"))

; Operators
[
  "+"
  "-"
  "*"
  "/"
  "%"
  "=="
  "!="
  "<"
  ">"
  "<="
  ">="
  "&&"
  "||"
  "!"
  "="
] @operator

; Punctuation
["(" ")" "[" "]" "{" "}"] @punctuation.bracket
["," "." ":" "?"] @punctuation.delimiter

; Error
(ERROR) @error
