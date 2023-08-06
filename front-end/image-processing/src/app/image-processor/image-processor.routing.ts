import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent} from "./home-page/home-page.component";
import {ImageService} from "./sevices/image.service";
import {UploadImageComponent} from "./component/upload-image/upload-image.component";
import {ThumbComponent} from "./component/thumb/thumb.component";

const routes: Routes = [
  {
    path: 'thumb',
    component: ThumbComponent,
  },
  {
    path: 'upload',
    component: UploadImageComponent,
  },
  {
    path: 'stock',
    component: HomePageComponent,
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    ImageService
  ]
})
export class ImageProcessorRouting { }
