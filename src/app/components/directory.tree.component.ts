import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ITreeState, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {Directory} from '../swagger/model/Directory';
import {Subscription} from 'rxjs/Subscription';
import {DirectoryService} from '../services/directory.service';

@Component({
  selector: 'app-directory-tree',
  styles: [`
    .tree-container {
      background-color: #DDDDDD;
      width: 225px;
      min-height: 500px;
      max-height: 750px;
      padding: 2px 0 2px 10px;
      display: inline-block;
      vertical-align: top;
    }
  `],
  template: `
    <div class="tree-container">
      <tree-root #tree [(state)]="state" [nodes]="treeNodes" (activate)="onActivateNode()"
                 (deactivate)="onDeactivateNode()"></tree-root>
    </div>`,
})
export class DirectoryTreeComponent implements OnInit, OnDestroy {

  @ViewChild('tree') treeComponent: TreeComponent;

  state: ITreeState;
  treeModel: TreeModel;
  treeNodes = [];
  lastActiveNode: TreeNode = null;
  lastActivateEventTime: number = 0;

  private readonly LS_ACTIVE_NODE = 'active.tree.node';

  private subscriptions: Subscription[] = [];

  constructor(
    private directoryService: DirectoryService,
  ) {}

  ngOnInit(): void {
    this.treeModel = this.treeComponent.treeModel;

    this.subscriptions.push(this.directoryService.directoryTreeReloaded$.subscribe((rootDirectory) => {
      this.updateTreeModel(rootDirectory);
    }));

    this.subscriptions.push(this.directoryService.directoryChanged$.subscribe((directory) => {
      const path = directory.treePath;
      const node = this.treeModel.getNodeById(path);
      if (!node) {
        throw new Error('Tree node not found for directory path: ' + path);
      }
      this.activateNode(node);
    }));

    this.directoryService.reloadDirectoryTree();
  }

  ngOnDestroy(): void {
    // always clean-up subscriptions when a component is destroyed
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;
  }

  onActivateNode(): void {
    if (Date.now() - this.lastActivateEventTime < 500) {
      return; // the event sometimes fires more than once... ignore the duplicate
    }

    const activeNode: TreeNode = this.treeModel.getActiveNode();
    const treePath = activeNode.id; // <-- we store the tree path as the node ID (it's unique by definition)

    this.lastActivateEventTime = Date.now();
    this.lastActiveNode = activeNode;
    localStorage.setItem(this.LS_ACTIVE_NODE, treePath);

    this.directoryService.changeDirectory(treePath);
  }

  onDeactivateNode(): void {
    if (!this.treeModel.getActiveNode()) {
      // If there's no active node at this point, it means that the user clicked on the active node causing it to deactivate;
      // In this case, do a content-refresh on that node by re-activating it.
      this.treeModel.setActiveNode(this.lastActiveNode, true);
    }
  }

  private updateTreeModel(rootDirectory: Directory) {
    this.treeNodes.length = 0;
    this.treeNodes.push(this.createTreeNode(rootDirectory));
    this.treeModel.update();

    // if applicable, re-activate the node that was active before the tree update, or the root
    const savedNodeId = localStorage.getItem(this.LS_ACTIVE_NODE);
    const savedNode = savedNodeId ? this.treeModel.getNodeById(savedNodeId) : null;
    this.activateNode(savedNode || this.treeModel.getFirstRoot());
  }

  private createTreeNode(directory: Directory): any {
    return {
      id: directory.treePath,
      name: directory.name,
      children: directory.children.map((child) => this.createTreeNode(child)),
    };
  }

  private activateNode(node: TreeNode) {
    if (!node) {
      throw new Error('Node to activate must be provided');
    }
    const root = this.treeModel.getFirstRoot();
    this.expandPath(root, node);
    this.treeModel.setActiveNode(node, true);
  }

  private expandPath(source: TreeNode, dest: TreeNode): void {
    if (source === dest) {
      return; // we're done
    }
    this.treeModel.setExpandedNode(source, true);
    source.children.forEach(child => {
      if (dest.isDescendantOf(child)) {
        this.expandPath(child, dest)
      }
    });
  }

}
