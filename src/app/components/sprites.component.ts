import {Component, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';
import {DirectoryService} from '../services/directory.service';

@Component({
  selector: 'app-sprites',
  styles: [``],
  template: `
    <div class="app-sprites-container" *ngIf="active">
      <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
    </div>
  `,
})
export class SpritesComponent implements OnInit {
  active = false;
  sprites: SpriteType[] = [];
  thumbnailUrls: string[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private directoryService: DirectoryService,
    private spriteTypeApi: SpriteTypeApi,
  ) { }

  ngOnInit(): void {
    this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.SPRITES) {
        this.loadSprites(this.directoryService.getCurrentDirectoryPath());
        this.active = true;
      } else {
        this.loadSprites(null);
        this.active = false;
      }
    });
  }

  onThumbnailSelected(selectedIndex: number): void {
    console.log('Selected thumbnail index: ' + selectedIndex);
  }

  private loadSprites(directory: string): void {
    if (!directory) {
      this.sprites.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }

    console.log('Loading sprites in directory: ' + directory);
    directory = ApiHelper.verifyPath(directory);

    const operation = this.loaderService.startOperation('Loading sprites');
    this.spriteTypeApi.findSpriteType(this.explorerService.getSelectedLibraryId(), directory)
      .toPromise()
      .then(response => {
        operation.stop();
        this.sprites = response.values;
        this.thumbnailUrls = this.sprites.map(sprite => sprite.image.gcsUrl);
      }, rejectReason => {
        operation.stop();
        this.alertService.error('Failed to load sprites (' + rejectReason + ')');
      });
  }

}
