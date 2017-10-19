import {Component, OnInit} from '@angular/core';

import {Alert, AlertType} from '../models/alert';
import {AlertService} from '../services/alert.service';

@Component({
  // moduleId: module.id,
  selector: 'app-alert',
  styles: [`
    .alerts-container {
      position: fixed;
      top: 0;
      right: 0;
      z-index: 5;
      width: 350px;
      margin: 10px;
    }
    .alert-message {
      display: inline-block;
      width: 250px;
      overflow-wrap: break-word;
      vertical-align: middle;
    }
    .alert button {
      vertical-align: middle;  
    }
    .alerts-dismiss-all {
      height: 35px;
    }
  `],
  template: `
    <!--<div class="alerts-temp">-->
      <!--<button type="button" class="btn btn-info" (click)="randomAlert()">Random alert</button>-->
    <!--</div>-->
    <div class="alerts-container" *ngIf="alerts.length > 0" (window:keyup.esc)="dismissAll()">
      <div class="alerts-dismiss-all">
        <button type="button" class="close" (click)="dismissAll()">&#9660; dismiss all (Esc)</button>
      </div>
      <div *ngFor="let alert of alerts" class="alert {{cssClass(alert)}} alert-dismissible">
        <div class="alert-message">{{alert.message}}</div>
        <button type="button" class="close" (click)="removeAlert(alert)">&times;</button>
      </div>
    </div>
  `,
})
export class AlertComponent implements OnInit {
  alerts: Alert[] = [];

  constructor(
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.alertService.alert$.subscribe((alert: Alert) => {
      if (!alert) {
        // clear alerts when an empty alert is received
        this.alerts = [];
        return;
      }
      // add alert to array
      this.alerts.push(alert);
    });
  }

  removeAlert(alert: Alert) {
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  // randomAlert() {
  //   this.alertService.info('Random alert ' + Date.now());
  // }

  dismissAll() {
    this.alerts = [];
  }

  // noinspection JSMethodCanBeStatic
  cssClass(alert: Alert) {
    if (!alert) {
      return;
    }

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'alert-success';
      case AlertType.Error:
        return 'alert-danger';
      case AlertType.Info:
        return 'alert-info';
      case AlertType.Warning:
        return 'alert-warning';
    }
  }
}
