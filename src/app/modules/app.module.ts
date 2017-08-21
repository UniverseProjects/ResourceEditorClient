import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {TreeModule} from 'angular-tree-component';

import {AppRoutingModule} from './app-routing.module';

import {ImageService} from '../services/image.service';

import {AppComponent} from '../components/app.component';
import {DashboardComponent} from '../components/dashboard.component';
import {ImagesComponent} from '../components/images.component';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AppRoutingModule,
        TreeModule,
    ],
    declarations: [
        AppComponent,
        DashboardComponent,
        ImagesComponent,
    ],
    providers: [
        ImageService,
    ],
    bootstrap: [
        AppComponent,
    ],
})
export class AppModule {
}
