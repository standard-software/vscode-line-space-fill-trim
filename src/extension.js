const vscode = require(`vscode`);

const {
  registerCommand,
  commandQuickPick,
} = require(`./lib/libVSCode.js`);

const {
  _trim,
  _trimFirst,
} = require(`./parts/parts.js`);

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
        vscode.window.showInformationMessage(`FillAllLines`);
      } break;
      case cmdFillTextLines: {
        vscode.window.showInformationMessage(`FillTextLines`);
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
