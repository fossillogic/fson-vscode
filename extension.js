const vscode = require("vscode");

/**
 * Very naive FSON formatter:
 * - Adds consistent spaces around colons.
 * - Indents objects/arrays with 2 spaces.
 */
function formatFson(text) {
  let indentLevel = 0;
  const indent = () => "  ".repeat(indentLevel);

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((l) => l.length > 0);

  const formatted = [];

  for (let line of lines) {
    // Add spacing around colons: key: type: value
    line = line.replace(/\s*:\s*/g, ": ");

    if (line.endsWith("}") || line.endsWith("],")) indentLevel--;

    formatted.push(indent() + line);

    if (line.endsWith("{") || line.endsWith("["))
      indentLevel++;
  }

  return formatted.join("\n");
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