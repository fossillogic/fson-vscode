# FSON Language Support

This VS Code extension provides:

- Syntax highlighting for `.fson` files
- Support for `//` and `/* ... */` comments
- Bracket matching for `{}` and `[]`
- Basic highlighting for types (`i32`, `f64`, `bool`, `array`, etc.)

## Installation

1. Clone this repo.
2. Run `npm install -g vsce` if you don’t have `vsce`.
3. Package: `vsce package`
4. Install the generated `.vsix` in VS Code (Extensions → … menu → Install from VSIX).

## Next Steps

- Add IntelliSense (type completion).
- Add formatter using `fossil_media_fson_stringify()`.
- Add FSON → JSON converter as a VS Code command.

## ✅ How This Looks in VS Code

```fson
// Example FSON file
config: object: {
    debug: bool: true,
    port: u16: 8080,
    message: cstr: "Hello\nWorld",
    data: array: [
        1: i32: 42,
        2: i32: 100
    ]
}
```

 * Keys (config, debug, port) → highlighted as tags
 * Types (object, bool, u16, array, i32) → highlighted as keywords
 * Booleans & null → highlighted as constants
 * Strings & numbers → colored appropriately

### Formatting

This extension now includes a **basic formatter**.  
Use **Right-click → Format Document** or `Shift+Alt+F` to reformat `.fson` files.

Features:
- Normalizes `key: type: value` spacing
- Indents nested objects/arrays with 2 spaces
- Removes empty/extra lines

Limitations:
- Not a full parser — just regex + indentation rules.
- Won’t validate syntax (yet).
- Future version can hook into `fossil_media_fson_stringify()` for 100% fidelity.

## 🔧 Example Before/After

Before:

```fson
config:object:{
debug:bool:true,
data:array:[
1:i32:42,
2:i32:100
]
}
```

After:

```fson
config: object: {
  debug: bool: true,
  data: array: [
    1: i32: 42,
    2: i32: 100
  ]
}
```
