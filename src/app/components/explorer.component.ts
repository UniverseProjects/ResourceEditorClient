import {Component, OnDestroy, OnInit} from '@angular/core';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {DirectoryService} from "../services/directory.service";
import {Subscription} from 'rxjs/Subscription';

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
    .items-container {
      margin-top: 20px;
    }
  `],
  template: `
    <div class="explorer-container">
      <directory-tree></directory-tree>
      <div class="directory-content">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onClickContentType('DIRECTORY'); false;"
               [class.active]="contentTypeStr==='DIRECTORY'">Directory</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onClickContentType('IMAGES'); false;"
               [class.active]="contentTypeStr==='IMAGES'">Images</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onClickContentType('SPRITE_TYPES'); false;"
               [class.active]="contentTypeStr==='SPRITE_TYPES'">Sprite Types</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#" (click)="onClickContentType('ANIMATED_SPRITE_TYPES'); false;"
               [class.active]="contentTypeStr==='ANIMATED_SPRITE_TYPES'">Animated Sprite Types</a>
          </li>
        </ul>
        <div class="current-dir">
          <span class="current-dir-label">Current directory: </span>
          <span class="current-dir-value">{{currentDirectory || '...'}}</span>
        </div>
        <div class="items-container">
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

  private readonly LS_CONTENT_TYPE = 'active.content.type';

  contentTypeStr = 'DIRECTORY';
  currentDirectory: string = null;

  private subscription: Subscription;

  constructor(
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
  ) {}

  ngOnInit() {
    const lastContentTypeStr = localStorage.getItem(this.LS_CONTENT_TYPE);
    if (lastContentTypeStr) {
      this.contentTypeStr = lastContentTypeStr;
    }
    this.subscription = this.directoryService.directoryChanged$.subscribe((directory) => {
      this.currentDirectory = directory.treePath;
      this.reloadContent();
    });
  }

  ngOnDestroy() {
    // always clean-up subscriptions when a component is destroyed
    this.subscription.unsubscribe();
  }

  onClickContentType(contentTypeStr: string) {
    this.contentTypeStr = contentTypeStr;
    this.reloadContent();
  }

  private reloadContent() {
    const contentType = ContentType[this.contentTypeStr];

    if (contentType === undefined || contentType === null) {
      throw new Error('Invalid enum string value: ' + this.contentTypeStr);
    } else if (contentType === ContentType.DIRECTORY) {
      this.explorerService.reloadDirectory();
    } else if (contentType === ContentType.IMAGES) {
      this.explorerService.reloadImages();
    } else if (contentType === ContentType.SPRITE_TYPES) {
      this.explorerService.reloadSpriteTypes();
    } else if (contentType === ContentType.ANIMATED_SPRITE_TYPES) {
      this.explorerService.reloadAnimatedSpriteTypes();
    } else {
      throw new Error('Unhandled case: ' + this.contentTypeStr);
    }

    localStorage.setItem(this.LS_CONTENT_TYPE, this.contentTypeStr);
  }
}
