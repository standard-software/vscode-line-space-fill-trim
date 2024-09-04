const vscode = require(`vscode`);
const split = require(`graphemesplit`);

const {
  registerCommand,
  commandQuickPick,
} = require(`./lib/libVSCode.js`);

const {
  _trim,
  _trimFirst,
  _trimLast,
} = require(`./parts/parts.js`);

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || `Assertion failed`);
  }
};

const textLength = (str) => {
  let result = 0;
  for(const char of split(str)){
    const codePoint = char.codePointAt(0);
    const len = 0x00 <= codePoint && codePoint <= 0xFF ? 1 : 2;
    result += len;
  }
  return result;
};

const getMaxLength = (editor, { continueEmptyLine }) => {
  let maxLength = 0;
  for (const { start, end } of editor.selections) {
    for (let i = start.line; i <= end.line; i += 1) {
      const line = editor.document.lineAt(i).text;
      if (continueEmptyLine && _trim(line) === ``) { continue; }
      const length = textLength(line);
      if (maxLength < length) {
        maxLength = length;
      }
    }
  }
  return maxLength;
};

const getMinIndent = (editor) => {
  let minIndent = Infinity;
  for (const { start, end } of editor.selections) {
    for (let i = start.line; i <= end.line; i += 1) {
      const line = editor.document.lineAt(i).text;
      if (_trim(line) === ``) { continue; }
      const indent = line.length - _trimFirst(line, [` `, `\t`]).length;
      if (indent < minIndent) {
        minIndent = indent;
      }
    }
  }
  if (minIndent === Infinity) { minIndent = 0; }
  return minIndent;
};

function activate(context) {

  const main = (commandName) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(`No editor is active`);
      return;
    }

    switch (commandName) {
    case cmdFillAllLines: {
      editor.edit(editBuilder => {
        const maxLength = getMaxLength(editor, { continueEmptyLine: false });
        const runAfterSelections = [];
        for (const { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            const insertSpaceCount = maxLength - textLength(line);
            editBuilder.insert(
              new vscode.Position(i, line.length),
              ` `.repeat(insertSpaceCount)
            );
            const selectColumn = line.length + insertSpaceCount;
            runAfterSelections.push(
              new vscode.Selection(i, selectColumn, i, selectColumn)
            );
          }
        }
        editor.selections = runAfterSelections;
      });
    } break;

    case cmdFillTextLines: {
      editor.edit(editBuilder => {
        const runAfterSelections = [];
        const maxLength = getMaxLength(editor, { continueEmptyLine: true });
        for (const { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            const insertSpaceCount = maxLength - textLength(line);
            if (_trim(line) === ``) { continue; }
            editBuilder.insert(
              new vscode.Position(i, line.length),
              ` `.repeat(insertSpaceCount)
            );
            const selectColumn = line.length + insertSpaceCount;
            runAfterSelections.push(
              new vscode.Selection(i, selectColumn, i, selectColumn)
            );
          }
        }
        editor.selections = runAfterSelections;
      });
    } break;

    case cmdTrimStart: {
      editor.edit(editBuilder => {
        const runAfterSelections = [];
        for (const { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            const trimLine = _trimFirst(line, [` `, `\t`]);
            if (line.length !== trimLine.length) {
              editBuilder.delete(new vscode.Range(
                i, 0, i, line.length - trimLine.length,
              ));
            }
            if (trimLine.length !== 0) {
              runAfterSelections.push(
                new vscode.Selection(i, 0, i, 0)
              );
            }
          }
        }
        editor.selections = runAfterSelections;
      });
    } break;

    case cmdTrimEnd: {
      editor.edit(editBuilder => {
        const runAfterSelections = [];
        for (const { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            const trimLine = _trimLast(line, [` `, `\t`]);
            if (line.length !== trimLine.length) {
              editBuilder.delete(
                new vscode.Range(
                  i, trimLine.length,
                  i, line.length
                )
              );
            }
            if (trimLine.length !== 0) {
              runAfterSelections.push(
                new vscode.Selection(i, trimLine.length, i, trimLine.length)
              );
            }
          }
        }
        editor.selections = runAfterSelections;
      });
    } break;

    case cmdTrim: {
      editor.edit(editBuilder => {
        const runAfterSelections = [];
        for (const { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            const trimLastLine = _trimLast(line, [` `, `\t`]);
            if (line.length !== trimLastLine.length) {
              editBuilder.delete(
                new vscode.Range(
                  i, trimLastLine.length,
                  i, line.length
                )
              );
            }
            const trimFirstLine = _trimFirst(trimLastLine, [` `, `\t`]);
            if (trimLastLine.length !== trimFirstLine.length) {
              editBuilder.delete(new vscode.Range(
                i, 0, i, trimLastLine.length - trimFirstLine.length,
              ));
            }
            if (trimFirstLine.length !== 0) {
              runAfterSelections.push(
                new vscode.Selection(i, 0, i, 0)
              );
            }
          }
        }
        editor.selections = runAfterSelections;
      });
    } break;
    case cmdCutMinIndent: {
      editor.edit(editBuilder => {
        const minIndent = getMinIndent(editor);
        const runAfterSelections = [];
        for (const { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            const trimLine = _trim(line);
            if ((trimLine.length === 0) && (line.length < minIndent)) {
              continue;
            }
            editBuilder.delete(new vscode.Range(
              i, 0, i, minIndent,
            ));
            if (trimLine.length !== 0) {
              runAfterSelections.push(
                new vscode.Selection(i, minIndent, i, minIndent)
              );
            }
          }
        }
        editor.selections = runAfterSelections;
      });
    } break;
    default: {
      throw new Error(`LineSpaceFillTrim main`);
    }
    }
  };

  const cmdFillAllLines = `FillAllLines`;
  registerCommand(context, `vscode-line-space-fill-trim.${cmdFillAllLines}`, () => {
    main(cmdFillAllLines);
  });

  const cmdFillTextLines = `FillTextLines`;
  registerCommand(context, `vscode-line-space-fill-trim.${cmdFillTextLines}`, () => {
    main(cmdFillTextLines);
  });

  const cmdTrimStart = `TrimStart`;
  registerCommand(context, `vscode-line-space-fill-trim.${cmdTrimStart}`, () => {
    main(cmdTrimStart);
  });

  const cmdTrimEnd = `TrimEnd`;
  registerCommand(context, `vscode-line-space-fill-trim.${cmdTrimEnd}`, () => {
    main(cmdTrimEnd);
  });

  const cmdTrim = `Trim`;
  registerCommand(context, `vscode-line-space-fill-trim.${cmdTrim}`, () => {
    main(cmdTrim);
  });

  const cmdCutMinIndent = `CutMinIndent`;
  registerCommand(context, `vscode-line-space-fill-trim.${cmdCutMinIndent}`, () => {
    main(cmdCutMinIndent);
  });

}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
