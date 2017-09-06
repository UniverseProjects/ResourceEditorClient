import {Component, OnInit} from '@angular/core';
import {Sprite} from '../models/sprite';
import {LibraryService} from '../services/library.service';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';
import {ContentType, ExplorerService} from '../services/explorer.service';

@Component({
  selector: 'app-sprites',
  styles: [``],
  template: `
    <div class="app-sprites-container" *ngIf="active">
      <!--<h3>Sprites</h3>-->
      <app-thumbnails [imageUrls]="thumbnailUrls" (onSelected)="onThumbnailSelected($event)"></app-thumbnails>
    </div>
  `,
})
export class SpritesComponent implements OnInit {
  active = false;
  sprites: Sprite[] = [];
  thumbnailUrls: string[] = [];

  constructor(
    private libraryService: LibraryService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private explorerService: ExplorerService,
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

  private loadSprites(directory: string): void {
    if (!directory) {
      this.sprites.length = 0;
      this.thumbnailUrls.length = 0;
      return;
    }

    const OPNAME = 'Loading sprites in directory ' + directory;
    this.loaderService.startOperation(OPNAME);
    this.libraryService.getSprites(directory).then(sprites => {
      this.sprites = sprites;
      this.thumbnailUrls = sprites.map(sprite => sprite.gcsUrl);

      this.loaderService.stopOperation(OPNAME);
    }, (rejectReason) => {
      this.alertService.error('Failed to load sprites (' + rejectReason + ')');
      this.loaderService.stopOperation(OPNAME);
    });
  }

  onThumbnailSelected(selectedIndex: number): void {
    console.log('Selected thumbnail index: ' + selectedIndex);
  }
}
