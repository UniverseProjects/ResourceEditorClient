import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExplorerView, ExplorerService} from '../services/explorer.service';
import {DirectoryService} from "../services/directory.service";
import {Subscription} from 'rxjs/Subscription';
import {C} from '../common/common';

@Component({
  selector: 'app-explorer',
  styles: [`
    .directory-content {
      width: 700px;
      padding: 0 10px;
      display: inline-block;
      vertical-align: top;
    }
    .current-dir {
      margin-top: 10px;
    }
    .current-dir-label {
      font-size: 18px;
    }
    .current-dir-value {
      font-size: 18px;
      font-weight: bold;
      font-family: "Courier New", Courier, monospace;
    }
    .explorer-views {
      margin-top: 20px;
    }
  `],
  template: `
    <div class="explorer-container">
      <directory-tree></directory-tree>
      <div class="directory-content">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onTabClicked('DIRECTORY_EDIT'); false;"
               [class.active]="currentViewStr==='DIRECTORY_EDIT'">Directory</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onTabClicked('IMAGE_LIST'); false;"
               [class.active]="currentViewStr==='IMAGE_LIST'">Images</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onTabClicked('SPRITE_TYPE_LIST'); false;"
               [class.active]="currentViewStr==='SPRITE_TYPE_LIST'">Sprite Types</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onTabClicked('ANIMATED_SPRITE_TYPE_LIST'); false;"
               [class.active]="currentViewStr==='ANIMATED_SPRITE_TYPE_LIST'">Animated Sprite Types</a>
          </li>
        </ul>
        <div class="current-dir">
          <span class="current-dir-label">Current directory: </span>
          <span class="current-dir-value">{{currentDirectory || '...'}}</span>
        </div>
        <div class="explorer-views">
          <directory-editor></directory-editor>
          <image-list></image-list>
          <image-preview></image-preview>
          <sprite-type-list></sprite-type-list>
          <sprite-type-preview></sprite-type-preview>
          <sprite-type-editor></sprite-type-editor>
          <animated-sprite-type-list></animated-sprite-type-list>
          <animated-sprite-type-preview></animated-sprite-type-preview>
        </div>
      </div>
    </div>
  `,
})
export class ExplorerComponent implements OnInit, OnDestroy {

  private readonly LS_ACTIVE_TAB = 'active.tab';
  private readonly VIEWS_WITH_TABS: ExplorerView[] = [
    ExplorerView.DIRECTORY_EDIT,
    ExplorerView.IMAGE_LIST,
    ExplorerView.SPRITE_TYPE_LIST,
    ExplorerView.ANIMATED_SPRITE_TYPE_LIST,
  ];

  currentViewStr: string = null;
  currentDirectory: string = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
  ) {}

  ngOnInit() {
    this.currentViewStr = localStorage.getItem(this.LS_ACTIVE_TAB);

    this.subscriptions.push(this.directoryService.directoryChanged$.subscribe((directory) => {
      this.explorerService.clearMainViews();
      this.currentDirectory = directory.treePath;
      this.updateView(this.currentViewStr);
    }));

    this.subscriptions.push(this.explorerService.openView$.subscribe((view) => {
      // write the 'current view' value when the service reports a change, because view-changes can be requested by other components
      this.currentViewStr = ExplorerView[view];
      if (this.VIEWS_WITH_TABS.indexOf(view) > -1) {
        // only update the 'active tab' value if the view has a corresponding tab here
        localStorage.setItem(this.LS_ACTIVE_TAB, this.currentViewStr);
      }
    }));
  }

  ngOnDestroy() {
    // always clean-up subscriptions when a component is destroyed
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions.length = 0;
  }

  onTabClicked(viewStr: string) {
    if (!C.defined(ExplorerView[viewStr])) {
      throw new Error('Tab specifies an invalid view: ' + viewStr);
    }
    this.explorerService.clearSelectedItems();
    this.updateView(viewStr);
  }

  updateView(viewStr: string) {
    let view = ExplorerView[viewStr];
    if (!C.defined(view)) {
      // this is where we fallback to a default view, if an incorrect value is supplied
      view = ExplorerView.DIRECTORY_EDIT;
    }
    this.explorerService.openAndReloadView(view);
  }

}
