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

  registerCommand(
    context,
    `vscode-line-space-fill-trim.helloWorld`,
    () => {
      vscode.window.showInformationMessage(
        `Hello World from vscode-line-space-fill-trim!!`
      );
    }
  );
}

function deactivate() {}

module.exports = {
  activate,
  deactivate
};
