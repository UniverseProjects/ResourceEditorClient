import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LoaderService {
  private operations = [];

  private subject = new Subject<string>();
  readonly runningOperation$ = this.subject.asObservable();

  startOperation(opName: string) {
    if (!opName) {
      throw new Error('Operation name can\'t be empty');
    }

    this.subject.next(opName);
  }

  stopOperation(opName: string) {
    if (!opName) {
      throw new Error('Operation name can\'t be empty');
    }

    this.operations = this.operations.filter(op => op !== opName);
    if (this.operations.length === 0) {
      this.subject.next(); // signal that there are no more running operations
    }
  }

  clear() {
    this.operations = [];
    this.subject.next();
  }

}
