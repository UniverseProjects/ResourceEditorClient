import {Component, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';
import {SpriteTypeApi} from '../swagger/api/SpriteTypeApi';
import {SpriteType} from '../swagger/model/SpriteType';
import {ApiHelper} from '../common/api.helper';

@Component({
  selector: 'app-sprites',
  styles: [``],
  template: `
    <div class="app-sprites-container" *ngIf="active">
      <!--<h3>Sprites</h3>-->
      <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
    </div>
  `,
  providers: [
    SpriteTypeApi,
  ],
})
export class SpritesComponent implements OnInit {
  active = false;
  sprites: SpriteType[] = [];
  thumbnailUrls: string[] = [];

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
    private spriteTypeApi: SpriteTypeApi,
  ) { }

  ngOnInit(): void {
    this.explorerService.reloadContent$.subscribe((contentType) => {
      if (contentType === ContentType.SPRITES) {
        this.loadSprites(this.explorerService.getCurrentDirectory());
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

    const OPNAME = 'Loading sprites';
    this.loaderService.startOperation(OPNAME);
    this.spriteTypeApi.findSpriteType(this.explorerService.getSelectedLibraryId(), directory)
      .toPromise()
      .then(response => {
        this.sprites = response.values;
        this.thumbnailUrls = this.sprites.map(sprite => sprite.image.gcsUrl);
        this.loaderService.stopOperation(OPNAME);
      }, rejectReason => {
        this.alertService.error('Failed to load sprites (' + rejectReason + ')');
        this.loaderService.stopOperation(OPNAME);
      })
      .catch(ApiHelper.handleError);
  }

}
