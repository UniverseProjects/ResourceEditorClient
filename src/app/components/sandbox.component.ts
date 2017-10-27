import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../services/alert.service';
import {LoaderService} from '../services/loader.service';

@Component({
  selector: 'sandbox',
  styles: [`
  `],
  template: `    
  `,
})
export class SandboxComponent implements OnInit, OnDestroy {

  constructor(
    private alertService: AlertService,
    private loaderService: LoaderService,
  ) {}

  ngOnInit() {
  }

  ngOnDestroy() {
  }

}
