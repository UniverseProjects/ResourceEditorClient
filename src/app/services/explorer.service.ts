import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {C} from '../common/common';
import {Image} from '../swagger/model/Image';
import {SpriteType} from '../swagger/model/SpriteType';

export enum ExplorerView {
  DIRECTORY,
  IMAGE_LIST,
  IMAGE_PREVIEW,
  SPRITE_TYPE_LIST,
  SPRITE_TYPE_PREVIEW,
  SPRITE_TYPE_EDIT,
  ANIMATED_SPRITE_TYPES,
}

@Injectable()
export class ExplorerService {

  private openViewSeq: ExplorerView[] = [];

  private openView_ = new Subject<ExplorerView>();
  readonly openView$ = this.openView_.asObservable();

  private reloadView_ = new Subject<ExplorerView>();
  readonly reloadView$ = this.reloadView_.asObservable();

  private selectedLibraryId = 5764201201008640; // hard-coded for now
  private selectedImage: Image;
  private selectedSpriteType: SpriteType;

  constructor() {}

  openAndReloadView(view: ExplorerView) {
    this.openView(view);
    this.reloadView(view);
  }

  openView(view: ExplorerView) {
    if (!C.defined(view)) {
      throw new Error('View must be specified');
    }
    this.openView_.next(view);

    this.openViewSeq.push(view);
    if (this.openViewSeq.length > 2) {
      this.openViewSeq.shift();
    }
  }

  reloadView(view: ExplorerView) {
    if (!C.defined(view)) {
      throw new Error('View must be specified');
    }
    this.reloadView_.next(view);
  }

  openLastView() {
    const lastView = this.popLastView();
    if (lastView) {
      this.openView(lastView);
    }
  }

  openAndReloadLastView() {
    const lastView = this.popLastView();
    if (lastView) {
      this.openAndReloadView(lastView);
    }
  }

  private popLastView(): ExplorerView {
    return this.openViewSeq.length > 1 ? this.openViewSeq.shift() : null;
  }

  setSelectedLibraryId(libraryId: number) {
    this.selectedLibraryId = libraryId;
  }
  getSelectedLibraryId(): number {
    return this.selectedLibraryId;
  }

  setSelectedImage(image: Image) {
    this.selectedImage = image;
  }
  getSelectedImage(): Image {
    return this.selectedImage;
  }

  setSelectedSpriteType(value: SpriteType) {
    this.selectedSpriteType = value;
  }
  getSelectedSpriteType(): SpriteType {
    return this.selectedSpriteType;
  }

}
