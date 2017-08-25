import {Component, OnInit, ViewChild} from '@angular/core';
import {ITreeState, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';
import {Directory} from '../data/directory';
import {LibraryService} from '../services/library.service';

@Component({
  selector: 'app-explorer',
  templateUrl: './explorer.component.html',
  styleUrls: ['./explorer.component.css'],
})
export class ExplorerComponent implements OnInit {

  @ViewChild('tree') treeComponent: TreeComponent;

  state: ITreeState;
  treeModel: TreeModel;

  lastFocusedNodeId: any;

  treeNodes = [];

  constructor (private libraryService: LibraryService) {}

  ngOnInit(): void {
    this.treeModel = this.treeComponent.treeModel;

    this.libraryService.getDirectoryTree().then(root => {
      this.treeNodes.length = 0; // empty the array

      // do not display the root - make its children the root level
      root.children.forEach((child: Directory) => {
        this.treeNodes.push(child.toTreeNode());
      });
      this.treeModel.update();
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
