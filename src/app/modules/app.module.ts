import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from '../components/app.component';
import {DashboardComponent} from '../components/dashboard.component';
import {ImagesComponent} from '../components/images.component';

import {ImageService} from '../services/image.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        AppRoutingModule,
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
