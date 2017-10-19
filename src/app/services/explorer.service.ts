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

  private openAndReloadView_ = new Subject<ExplorerView>();
  readonly openAndReloadView$ = this.openAndReloadView_.asObservable();

  getSelectedLibraryId(): number {
    return this.selectedLibraryId;
  }

  openAndReloadView(view: ExplorerView) {
    if (!C.defined(view)) {
      throw new Error('View must be specified');
    }
    this.openAndReloadView_.next(view);
  }

}
