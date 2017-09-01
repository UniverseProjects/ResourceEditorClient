import {Component, OnInit, ViewChild} from '@angular/core';
import {ITreeState, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {Directory} from '../models/directory';
import {LibraryService} from '../services/library.service';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-directory-tree',
  template: `
    <div class="tree-container">
      <tree-root #tree [(state)]="state" [nodes]="treeNodes" (focus)="onFocus($event)"></tree-root>
    </div>`,
  styles: [`
  .tree-container {
    background-color: #DDDDDD;
    width: 225px;
    height: 500px;
    padding: 2px 0 2px 10px;
    display: inline-block;
    vertical-align: top;
  }`],
})
export class DirectoryTreeComponent implements OnInit {

  @ViewChild('tree') treeComponent: TreeComponent;

  state: ITreeState;
  treeModel: TreeModel;
  lastFocusedNodeId: any;
  treeNodes = [];

  constructor(
    private libraryService: LibraryService,
    private alertService: AlertService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit(): void {
    this.treeModel = this.treeComponent.treeModel;

    this.loadDirectoryTree();
  }

  private loadDirectoryTree(): void {
    const OPNAME = 'Loading directories';

    this.loaderService.startOperation(OPNAME);
    this.libraryService.getDirectoryTree().then(rootDirectory => {
      this.treeNodes.length = 0; // empty the array
      // do not display the root - make its children the root level
      rootDirectory.children.forEach((child: Directory) => {
        this.treeNodes.push(child.toTreeNode());
      });
      this.treeModel.update();
      this.loaderService.stopOperation(OPNAME);
    }, (rejectReason) => {
      this.alertService.error('Failed to load directories (' + rejectReason + ')');
      this.loaderService.stopOperation(OPNAME);
    });
  }

  // noinspection JSUnusedLocalSymbols
  onFocus($event): void {
    // console.log($event);
    const focusedNode: TreeNode = this.treeModel.getFocusedNode();
    const id = focusedNode.id;
    if (this.lastFocusedNodeId === id) {
      return; // at the time of this writing, the 'focus' event fires twice... ignore
    }
    this.lastFocusedNodeId = id;
    console.log('Focused node: ' + id);

    this.libraryService.changeDirectory(id); // the ID of the node is the directory path
  }

}
