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
    <app-directory-tree></app-directory-tree>
    <div class="directory-content">
      <div class="btn-group">
        <label class="btn btn-lg btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="DIRECTORY">Directory</label>
        <label class="btn btn-lg btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="IMAGES">Images</label>
        <label class="btn btn-lg btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="SPRITES">Sprites</label>
        <label class="btn btn-lg btn-primary" [(ngModel)]="contentTypeStr" (click)="onClickContentType()" btnRadio="ANIMATED_SPRITES">Animated Sprites</label>
      </div>
      <div class="current-dir">
        <span class="current-dir-label">Current directory: </span>
        <span class="current-dir-value">{{currentDirectory || '...'}}</span>
      </div>
      <div class="items-container">
        <app-directory-view></app-directory-view>
        <app-images-view></app-images-view>
        <app-sprites-view></app-sprites-view>
        <app-animated-sprites-view></app-animated-sprites-view>
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

  ngOnInit(): void {
    const lastContentTypeStr = localStorage.getItem(this.LS_CONTENT_TYPE);
    if (lastContentTypeStr) {
      this.contentTypeStr = lastContentTypeStr;
    }
    this.subscription = this.directoryService.directoryChanged$.subscribe((directory) => {
      this.currentDirectory = directory.treePath;
      this.reloadContent();
    });
  }

  ngOnDestroy(): void {
    // always clean-up subscriptions when a component is destroyed
    this.subscription.unsubscribe();
  }

  onClickContentType(): void {
    this.reloadContent();
  }

  private reloadContent(): void {
    const contentType = ContentType[this.contentTypeStr];

    if (contentType === undefined || contentType === null) {
      throw new Error('Invalid enum string value: ' + this.contentTypeStr);
    } else if (contentType === ContentType.DIRECTORY) {
      this.explorerService.reloadDirectory();
    } else if (contentType === ContentType.IMAGES) {
      this.explorerService.reloadImages();
    } else if (contentType === ContentType.SPRITES) {
      this.explorerService.reloadSprites();
    } else if (contentType === ContentType.ANIMATED_SPRITES) {
      this.explorerService.reloadAnimatedSprites();
    } else {
      throw new Error('Unhandled case: ' + this.contentTypeStr);
    }

    localStorage.setItem(this.LS_CONTENT_TYPE, this.contentTypeStr);
  }
}
