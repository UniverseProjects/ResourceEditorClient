import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {DashboardComponent} from '../components/dashboard.component';
import {ImagesComponent} from '../components/images.component';
import {SpritesComponent} from '../components/sprites.component';
import {AnimatedSpritesComponent} from '../components/animated-sprites.component';
import {MarkersComponent} from '../components/markers.component';

const routes: Routes = [
    {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'images', component: ImagesComponent},
    {path: 'sprites', component: SpritesComponent},
    {path: 'animatedSprites', component: AnimatedSpritesComponent},
    {path: 'markers', component: MarkersComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
