import * as vscode from 'vscode';
import { validateFSON } from './parser/fsonValidator.js';

const KNOWN_TYPES = [
    "null", "bool",
    "i8","i16","i32","i64",
    "u8","u16","u32","u64",
    "f32","f64",
    "hex","oct","bin",
    "cstr","char",
    "array","object"
];

export function activate(context) {
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('fson');
    context.subscriptions.push(diagnosticCollection);

    // Diagnostics (linting)
    vscode.workspace.onDidChangeTextDocument(event => {
        if (event.document.languageId === 'fson') {
            const diagnostics = [];
            const results = validateFSON(event.document.getText());
            results.forEach(r => {
                diagnostics.push(new vscode.Diagnostic(
                    new vscode.Range(r.range.start.line, r.range.start.character, r.range.end.line, r.range.end.character),
                    r.message,
                    r.severity === 1 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning
                ));
            });
            diagnosticCollection.set(event.document.uri, diagnostics);
        }
    });

    // Auto-completion provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        { language: 'fson' },
        {
            provideCompletionItems(document, position) {
                const line = document.lineAt(position).text;
                const beforeCursor = line.substring(0, position.character);

                // Only trigger if we are right after "key:"
                if (beforeCursor.trim().endsWith(":")) {
                    return KNOWN_TYPES.map(type => {
                        const item = new vscode.CompletionItem(type, vscode.CompletionItemKind.EnumMember);
                        item.insertText = type + ": "; // auto add ": " after type
                        item.detail = "FSON Type";
                        return item;
                    });
                }

                return [];
            }
        },
        ":" // Trigger character
    );

    context.subscriptions.push(completionProvider);
}

export function deactivate() {}