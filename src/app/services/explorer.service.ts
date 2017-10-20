import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {C} from '../common/common';
import {Image} from '../swagger/model/Image';

export enum ExplorerView {
  DIRECTORY,
  IMAGE_LIST,
  IMAGE_PREVIEW,
  SPRITE_TYPES,
  ANIMATED_SPRITE_TYPES,
}

@Injectable()
export class ExplorerService {

  // TODO: implement library-selection by the user
  private readonly selectedLibraryId = 5764201201008640;

  private openView_ = new Subject<ExplorerView>();
  readonly openView$ = this.openView_.asObservable();

  private reloadView_ = new Subject<ExplorerView>();
  readonly reloadView$ = this.reloadView_.asObservable();

  private selectedImage: Image;

  getSelectedLibraryId(): number {
    return this.selectedLibraryId;
  }

  openAndReloadView(view: ExplorerView) {
    this.openView(view);
    this.reloadView(view);
  }

  openView(view: ExplorerView) {
    if (!C.defined(view)) {
      throw new Error('View must be specified');
    }
    this.openView_.next(view);
  }

  reloadView(view: ExplorerView) {
    if (!C.defined(view)) {
      throw new Error('View must be specified');
    }
    this.reloadView_.next(view);
  }

  setSelectedImage(image: Image) {
    this.selectedImage = image;
  }
  getSelectedImage(): Image {
    return this.selectedImage;
  }

}
