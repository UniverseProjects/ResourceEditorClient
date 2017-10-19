import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  styles: [`
    .app-header {
      position: relative;
      background-color: #ffffff;
      padding-bottom: 10px;
      height: 55px;
      line-height: 55px;
      overflow: hidden;
      z-index: 2;
    }
    .app-logo {
      text-decoration: none;
      line-height: 1;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-size: 37px;
      font-weight: bold;
      letter-spacing: 1px;
      color: #555555;
      display: block;
    }
    .app-logo-part1 {
      margin-right: 8px;
    }
    .app-logo-part2 {
      color: #4CAF50;
    }
  `],
  template: `
    <div class="container-fluid">
      <div class="app-header">
        <div class="app-logo">
          <span class="app-logo-part1">universe projects</span>
          <span class="app-logo-part2">resource editor</span>
        </div>
      </div>
      <!--<nav>-->
      <!--<a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>-->
      <!--<a routerLink="/explorer" routerLinkActive="active">Explorer</a>-->
      <!--</nav>-->
      <loader></loader>
      <alerts></alerts>
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {
}
