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
            <a class="nav-link" href="#" (click)="updateView('DIRECTORY'); false;" 
               [class.active]="viewStr==='DIRECTORY'">Directory</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="updateView('IMAGES'); false;"
               [class.active]="viewStr==='IMAGES'">Images</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="updateView('SPRITE_TYPES'); false;"
               [class.active]="viewStr==='SPRITE_TYPES'">Sprite Types</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="updateView('ANIMATED_SPRITE_TYPES'); false;"
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

  viewStr = 'DIRECTORY';
  currentDirectory: string = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
  ) {}

  ngOnInit() {
    const lastContentTypeStr = localStorage.getItem(this.LS_ACTIVE_VIEW);
    if (lastContentTypeStr) {
      this.viewStr = lastContentTypeStr;
    }
    this.subscriptions.push(this.directoryService.directoryChanged$.subscribe((directory) => {
      this.currentDirectory = directory.treePath;
      this.updateView(this.viewStr);
    }));

  }

  ngOnDestroy() {
    // always clean-up subscriptions when a component is destroyed
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  updateView(viewStr: string) {
    const view = ExplorerView[viewStr];
    if (!C.defined(view)) {
      throw new Error('String does not translate to enum: ' + viewStr);
    }
    this.viewStr = viewStr;
    localStorage.setItem(this.LS_ACTIVE_VIEW, viewStr);
    this.explorerService.openAndReloadView(view);
  }
}
