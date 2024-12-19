const path = require('path');
const { workspace, ExtensionContext } = require('vscode');
const { LanguageClient, TransportKind } = require('vscode-languageclient/node');

let client;

function activate(context) {
    // Path to the LSP server jar relative to the extension
    const serverPath = context.asAbsolutePath(path.join('server', 'yaml-testfiles-lsp-1.0-SNAPSHOT.jar'));

    // Server options
    const serverOptions = {
        run: {
            command: 'java',
            args: ['-jar', serverPath],
            transport: TransportKind.stdio
        },
        debug: {
            command: 'java',
            args: [
                '-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005',
                '-jar',
                serverPath
            ],
            transport: TransportKind.stdio
        }
    };

    // Client options
    const clientOptions = {
        documentSelector: [
            { scheme: 'file', language: 'yaml' }
        ],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher('**/*.{yml,yaml}')
        }
    };

    // Create and start the client
    client = new LanguageClient(
        'yamlTestFiles',
        'YAML Test Files',
        serverOptions,
        clientOptions
    );

    // Start the client and store the client start promise
    context.subscriptions.push(client.start());
}

function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

module.exports = { activate, deactivate };
