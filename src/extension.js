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


  registerCommand(context, `vscode-line-space-fill-trim.FillAllLines`, () => {
    vscode.window.showInformationMessage(`vscode-line-space-fill-trim.FillAllLines`);
  });

  registerCommand(context, `vscode-line-space-fill-trim.FillTextLines`, () => {
    vscode.window.showInformationMessage(`vscode-line-space-fill-trim.FillTextLines`);
  });

  registerCommand(context, `vscode-line-space-fill-trim.TrimStart`, () => {
    vscode.window.showInformationMessage(`vscode-line-space-fill-trim.TrimStart`);
  });

  registerCommand(context, `vscode-line-space-fill-trim.TrimEnd`, () => {
    vscode.window.showInformationMessage(`vscode-line-space-fill-trim.TrimEnd`);
  });

  registerCommand(context, `vscode-line-space-fill-trim.Trim`, () => {
    vscode.window.showInformationMessage(`vscode-line-space-fill-trim.Trim`);
  });

  registerCommand(context, `vscode-line-space-fill-trim.CutMinIndent`, () => {
    vscode.window.showInformationMessage(`vscode-line-space-fill-trim.CutMinIndent`);
  });

}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
