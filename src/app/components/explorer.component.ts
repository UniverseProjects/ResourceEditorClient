import {Component, OnInit, ViewChild} from '@angular/core';
import {ITreeState, TreeComponent, TreeModel, TreeNode} from 'angular-tree-component';

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

  nodes = [
    {
      id: '1', name: 'GUI',
      children: [
        {id: '1.1', name: 'blue'},
        {id: '1.2', name: 'im'},
        {id: '1.3', name: 'selector'},
      ]
    },
    {
      id: '2', name: 'effects',
      children: [
        {id: '2.1', name: 'wormhole'},
      ]
    },
    {id: '3', name: 'asteroids'},
    {id: '4', name: 'bases'},
    {id: '5', name: 'drones'},
    {id: '6', name: 'explosion'},
    {id: '7', name: 'icons'},
    {id: '8', name: 'invention'},
    {id: '9', name: 'main-toolbar'},
    {id: '10', name: 'map-indicators'},
    {id: '11', name: 'missiles'},
    {id: '12', name: 'ships'},
    {id: '13', name: 'turrets'},
    {id: '15', name: 'wrecks'},
  ];

  ngOnInit(): void {
    this.treeModel = this.treeComponent.treeModel;
  }

  // noinspection JSUnusedLocalSymbols
  onFocus($event): void {
    // console.log($event);
    const focusedNode: TreeNode = this.treeModel.getFocusedNode();
    if (!focusedNode) {
      return;
    }

    const id = focusedNode.id;
    if (this.lastFocusedNodeId === id) {
      return; // at the time of this writing, the 'focus' event fires twice... ignore
    }
    this.lastFocusedNodeId = id;
    console.log('Focused node: ' + id + ', name: ' + focusedNode.displayField);
  }

}
