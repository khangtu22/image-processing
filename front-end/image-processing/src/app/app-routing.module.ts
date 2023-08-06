import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./image-processor/home-page/home-page.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    data: {
      title: 'Home',
    },
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
