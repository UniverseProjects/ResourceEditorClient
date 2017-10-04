import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class LoaderService {
  private operations = [];

  private subject = new Subject<string>();
  readonly runningOperation$ = this.subject.asObservable();

  startOperation(opName: string): Operation {
    if (!opName) {
      throw new Error('Operation name can\'t be empty');
    }

    this.subject.next(opName);
    return new Operation(this, opName);
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

export class Operation {
  private loaderService: LoaderService;
  private name: string;
  constructor(loaderService: LoaderService, name: string) {
    this.loaderService = loaderService;
    this.name = name;
  }
  stop() {
    this.loaderService.stopOperation(this.name);
  }
}
