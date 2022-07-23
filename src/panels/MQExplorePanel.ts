import * as vscode from "vscode";

export class MQExplorePanel implements vscode.WebviewViewProvider {
  public static readonly viewId = "message-queue-explorer.explorView";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    // webviewView.webview.onDidReceiveMessage((data) => {
    //   switch (data.type) {
    //     case "colorSelected": {
    //       vscode.window.activeTextEditor?.insertSnippet(
    //         new vscode.SnippetString(`#${data.value}`)
    //       );
    //       break;
    //     }
    //   }
    // });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hello World!</title>
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `;
  }
}
