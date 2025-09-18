const vscode = require("vscode");

/**
 * A pretty-printer that tries to mimic fossil_media_fson_stringify(pretty=1)
 */
function formatFson(text) {
  let indentLevel = 0;
  const INDENT = "  ";
  let result = "";

  const tokens = text
    // Preserve trailing commas by capturing them as tokens
    .replace(/,\s*/g, ",\n")
    // Split on newlines and trim
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  for (let line of tokens) {
    // Normalize spacing around colon (only if not inside quotes)
    line = line.replace(/([^"']):\s*/g, "$1: ");

    // Decrease indent before closing braces/brackets
    if (/^\}/.test(line) || /^\]/.test(line)) indentLevel--;

    result += INDENT.repeat(indentLevel) + line + "\n";

    // Increase indent after opening brace/bracket
    if (/{\s*$/.test(line) || /\[\s*$/.test(line)) indentLevel++;
  }

  return result.trimEnd();
}

function activate(context) {
  context.subscriptions.push(
    vscode.languages.registerDocumentFormattingEditProvider("fson", {
      provideDocumentFormattingEdits(document) {
        const text = document.getText();
        const formatted = formatFson(text);
        const firstLine = document.lineAt(0);
        const lastLine = document.lineAt(document.lineCount - 1);
        const fullRange = new vscode.Range(firstLine.range.start, lastLine.range.end);

        return [vscode.TextEdit.replace(fullRange, formatted)];
      },
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };