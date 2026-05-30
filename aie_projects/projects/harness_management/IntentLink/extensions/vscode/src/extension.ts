import * as vscode from "vscode";

import { createExtensionController } from "./extensionController.js";
import type { VscodeChangedFile } from "./gitChangedFilesProvider.js";
import {
  createTreeViewModel,
  type TreeViewFileNode,
  type TreeViewModel,
} from "./treeViewModel.js";
import {
  createVscodeGitChangedFilesProvider,
  type VscodeGitApi,
} from "./vscodeGitAdapter.js";

interface GitExtension {
  getAPI(version: 1): VscodeGitApi;
}

class HarnessLensTreeProvider
  implements vscode.TreeDataProvider<TreeViewModel["nodes"][number] | TreeViewFileNode>
{
  private readonly emitter = new vscode.EventEmitter<void>();
  private model: TreeViewModel = createTreeViewModel({
    availability: "available",
    files: [],
  });

  readonly onDidChangeTreeData = this.emitter.event;

  publish(model: TreeViewModel): void {
    this.model = model;
    this.emitter.fire();
  }

  getTreeItem(
    node: TreeViewModel["nodes"][number] | TreeViewFileNode,
  ): vscode.TreeItem {
    if (node.type === "unavailable") {
      return new vscode.TreeItem(node.label);
    }

    if (node.type === "group") {
      const item = new vscode.TreeItem(
        `${node.label} (${node.count})`,
        vscode.TreeItemCollapsibleState.Expanded,
      );
      item.contextValue = "harnesslens.group";
      return item;
    }

    const item = new vscode.TreeItem(node.label);
    item.description = node.status;
    item.contextValue = "harnesslens.file";
    item.command = {
      command: "harnesslens.openDiff",
      title: "Open Diff",
      arguments: [{ path: node.path, status: node.status }],
    };
    return item;
  }

  getChildren(
    node?: TreeViewModel["nodes"][number] | TreeViewFileNode,
  ): Array<TreeViewModel["nodes"][number] | TreeViewFileNode> {
    if (node?.type === "group") {
      return node.children;
    }
    return node === undefined ? this.model.nodes : [];
  }
}

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const treeProvider = new HarnessLensTreeProvider();
  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
  );
  statusBar.name = "HarnessLens";
  statusBar.command = "harnesslens.refresh";
  statusBar.show();

  const gitApi = vscode.extensions
    .getExtension<GitExtension>("vscode.git")
    ?.exports?.getAPI(1);
  const provider = createVscodeGitChangedFilesProvider(gitApi);

  const host = {
    registerCommand(command: string, callback: (...args: unknown[]) => unknown) {
      const disposable = vscode.commands.registerCommand(command, callback);
      context.subscriptions.push(disposable);
      return disposable;
    },
    publishTree(model: TreeViewModel) {
      treeProvider.publish(model);
    },
    publishStatus(text: string) {
      statusBar.text = `$(list-tree) HarnessLens: ${text}`;
    },
    async openFile(file: VscodeChangedFile) {
      await vscode.commands.executeCommand("vscode.open", vscode.Uri.file(file.path));
    },
    async openDiff(file: VscodeChangedFile) {
      await vscode.commands.executeCommand("git.openChange", vscode.Uri.file(file.path));
    },
  };

  context.subscriptions.push(
    statusBar,
    vscode.window.registerTreeDataProvider("harnesslens.changedFiles", treeProvider),
  );

  await createExtensionController({ host, provider }).activate();
}

export function deactivate(): void {}
