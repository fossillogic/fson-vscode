export function validateFSON(text) {
    const diagnostics = [];
    const lines = text.split("\n");

    // Regex patterns
    const keyValuePattern = /^\s*([A-Za-z0-9_]+)\s*:\s*([A-Za-z0-9_]+)\s*:\s*(.+)$/;
    const knownTypes = new Set([
        "null", "bool",
        "i8","i16","i32","i64",
        "u8","u16","u32","u64",
        "f32","f64",
        "hex","oct","bin",
        "cstr","char",
        "array","object"
    ]);

    let braceStack = [];

    lines.forEach((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Track braces for structure validation
        if (trimmed.endsWith("{")) braceStack.push({ type: "{", line: index });
        if (trimmed.endsWith("[")) braceStack.push({ type: "[", line: index });
        if (trimmed.startsWith("}")) {
            if (braceStack.length === 0 || braceStack.pop().type !== "{") {
                diagnostics.push({
                    message: "Unmatched closing brace '}'",
                    range: { start: { line: index, character: 0 }, end: { line: index, character: line.length } },
                    severity: 1
                });
            }
        }
        if (trimmed.startsWith("]")) {
            if (braceStack.length === 0 || braceStack.pop().type !== "[") {
                diagnostics.push({
                    message: "Unmatched closing bracket ']'",
                    range: { start: { line: index, character: 0 }, end: { line: index, character: line.length } },
                    severity: 1
                });
            }
        }

        // Validate key:type:value structure (only if not a pure { or } line)
        if (!trimmed.startsWith("{") && !trimmed.startsWith("}") &&
            !trimmed.startsWith("[") && !trimmed.startsWith("]")) {
            const match = trimmed.match(keyValuePattern);
            if (!match) {
                diagnostics.push({
                    message: "Expected key: type: value",
                    range: { start: { line: index, character: 0 }, end: { line: index, character: line.length } },
                    severity: 1
                });
            } else {
                const type = match[2];
                if (!knownTypes.has(type)) {
                    diagnostics.push({
                        message: `Unknown type '${type}'`,
                        range: { start: { line: index, character: 0 }, end: { line: index, character: line.length } },
                        severity: 2
                    });
                }
            }
        }
    });

    // Report unclosed braces/brackets
    braceStack.forEach(unclosed => {
        diagnostics.push({
            message: `Unclosed ${unclosed.type === '{' ? 'object' : 'array'}`,
            range: { start: { line: unclosed.line, character: 0 }, end: { line: unclosed.line, character: lines[unclosed.line].length } },
            severity: 1
        });
    });

    return diagnostics;
}