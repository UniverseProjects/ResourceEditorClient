import {Component, OnInit} from '@angular/core';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'app-loader',
  template: `
    <div class="loader-container">
      <ngx-loading [show]="loading" [config]="LOADER_CONFIG"></ngx-loading>
    </div>`,
})
export class LoaderComponent implements OnInit {
  readonly LOADER_CONFIG = {
    backdropBackgroundColour: 'rgba(200,200,200,0.3)',
    primaryColour: '#999',
    secondaryColour: '#999',
    tertiaryColour: '#999',
  };

  loading = false;

  constructor(private loaderService: LoaderService) {
  }

  ngOnInit() {
    this.loaderService.runningOperation$.subscribe((opName: string) => {
      // noinspection RedundantIfStatementJS
      if (opName) {
        // console.log('Activating loader for operation: ' + opName);
        this.loading = true;
      } else {
        // console.log('Deactivating loader - no more operations');
        this.loading = false;
      }
    });
  }

}
