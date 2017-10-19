import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {C} from '../common/common';

export enum ExplorerView {
  DIRECTORY,
  IMAGES,
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

}
