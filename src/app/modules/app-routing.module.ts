import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {ExplorerComponent} from '../components/explorer.component';
import {ImagesComponent} from '../components/images.component';

const routes: Routes = [
    {path: '', redirectTo: '/explorer', pathMatch: 'full'},
    {path: 'explorer', component: ExplorerComponent},
    {path: 'images', component: ImagesComponent},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
