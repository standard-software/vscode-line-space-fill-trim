const vscode = require(`vscode`);
const split = require(`graphemesplit`);

const {
  registerCommand,
  commandQuickPick,
} = require(`./lib/libVSCode.js`);

const {
  _trim,
  _trimFirst,
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
  for (let { start, end } of editor.selections) {
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

function activate(context) {

  const main = (commandName) => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(`No editor is active`);
      return;
    }
    editor.edit(editBuilder => {
      switch (commandName) {
      case cmdFillAllLines: {
        const runAfterSelections = [];
        const maxLength = getMaxLength(editor, { continueEmptyLine: false });
        console.log({ maxLength });
        for (let { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            editBuilder.insert(
              new vscode.Position(i, line.length),
              ` `.repeat(maxLength - textLength(line))
            );
            runAfterSelections.push(
              new vscode.Selection(i, maxLength, i, maxLength)
            );
          }
        }
        editor.selections = runAfterSelections;
      } break;

      case cmdFillTextLines: {
        const runAfterSelections = [];
        const maxLength = getMaxLength(editor, { continueEmptyLine: true });
        for (let { start, end } of editor.selections) {
          for (let i = start.line; i <= end.line; i += 1) {
            const line = editor.document.lineAt(i).text;
            if (_trim(line) === ``) { continue; }
            editBuilder.insert(
              new vscode.Position(i, line.length),
              ` `.repeat(maxLength - textLength(line))
            );
            runAfterSelections.push(
              new vscode.Selection(i, maxLength, i, maxLength)
            );
          }
        }
        editor.selections = runAfterSelections;
      } break;

      case cmdTrimStart: {
        vscode.window.showInformationMessage(`TrimStart`);
      } break;
      case cmdTrimEnd: {
        vscode.window.showInformationMessage(`TrimEnd`);
      } break;
      case cmdTrim: {
        vscode.window.showInformationMessage(`Trim`);
      } break;
      case cmdCutMinIndent: {
        vscode.window.showInformationMessage(`CutMinIndent`);
      } break;
      default: {
        throw new Error(`LineSpaceFillTrim main`);
      }
      }
    });
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
