import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';

import {AppRoutingModule} from './app-routing.module';

import {ImageService} from '../services/image.service';

import {AppComponent} from '../components/app.component';
import {DashboardComponent} from '../components/dashboard.component';
import {ImagesComponent} from '../components/images.component';
import {SpritesComponent} from '../components/sprites.component';
import {AnimatedSpritesComponent} from '../components/animated-sprites.component';

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
        SpritesComponent,
        AnimatedSpritesComponent,
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
