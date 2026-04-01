; Scopes
(source_file) @scope
(func_declaration) @scope
(decl_declaration) @scope
(block) @scope
(for_statement) @scope
(list_comprehension) @scope
(map_comprehension) @scope

; Definitions
(let_declaration
  (identifier) @definition.var)

(func_declaration
  (identifier) @definition.function)

(decl_declaration
  (dotted_name) @definition.function)

(type_declaration
  (identifier) @definition.type)

(enum_declaration
  (identifier) @definition.type)

(field_definition
  (identifier) @definition.parameter)

(for_statement
  (identifier) @definition.var)

(list_comprehension
  variable: (identifier) @definition.var)

(map_comprehension
  variable: (identifier) @definition.var)

; References
(identifier) @reference
