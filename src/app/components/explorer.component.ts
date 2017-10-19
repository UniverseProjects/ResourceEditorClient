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
            <a class="nav-link" href="#" (click)="onTabClicked('DIRECTORY'); false;" 
               [class.active]="viewStr==='DIRECTORY'">Directory</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onTabClicked('IMAGES'); false;"
               [class.active]="viewStr==='IMAGES'">Images</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onTabClicked('SPRITE_TYPES'); false;"
               [class.active]="viewStr==='SPRITE_TYPES'">Sprite Types</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onTabClicked('ANIMATED_SPRITE_TYPES'); false;"
               [class.active]="viewStr==='ANIMATED_SPRITE_TYPES'">Animated Sprite Types</a>
          </li>
        </ul>
        <div class="current-dir">
          <span class="current-dir-label">Current directory: </span>
          <span class="current-dir-value">{{currentDirectory || '...'}}</span>
        </div>
        <div class="explorer-views">
          <directory-view></directory-view>
          <images-view></images-view>
          <sprite-types-view></sprite-types-view>
          <animated-sprite-types-view></animated-sprite-types-view>
        </div>
      </div>
    </div>
  `,
})
export class ExplorerComponent implements OnInit, OnDestroy {

  private readonly LS_ACTIVE_VIEW = 'active.view';

  viewStr: string = null;
  currentDirectory: string = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
  ) {}

  ngOnInit() {
    this.viewStr = localStorage.getItem(this.LS_ACTIVE_VIEW);

    this.subscriptions.push(this.directoryService.directoryChanged$.subscribe((directory) => {
      this.currentDirectory = directory.treePath;
      this.updateView(this.viewStr);
    }));
  }

  ngOnDestroy() {
    // always clean-up subscriptions when a component is destroyed
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  onTabClicked(viewStr: string) {
    if (!C.defined(ExplorerView[viewStr])) {
      throw new Error('Tab specifies an invalid view: ' + viewStr);
    }
    this.updateView(viewStr);
  }

  updateView(viewStr: string) {
    let view = ExplorerView[viewStr];
    if (!C.defined(view)) {
      view = ExplorerView.DIRECTORY;
    }
    this.viewStr = ExplorerView[view];
    localStorage.setItem(this.LS_ACTIVE_VIEW, this.viewStr);

    this.explorerService.openAndReloadView(view);
  }

}
