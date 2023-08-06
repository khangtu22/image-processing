import {NgModule} from "@angular/core";
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { HeaderComponent } from './component/header/header.component';
import { FooterComponent } from './component/footer/footer.component';
import { HomePageComponent } from './home-page/home-page.component';
import {ImageProcessorRouting} from "./image-processor.routing";
import {BrowserModule} from "@angular/platform-browser";
import {AppRoutingModule} from "../app-routing.module";
import {CommonModule} from "@angular/common";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterModule} from "@angular/router";
import { ImageListingComponent } from './component/image-listing/image-listing.component';
import { UploadImageComponent } from './component/upload-image/upload-image.component';
import {ReactiveFormsModule} from "@angular/forms";
import { ThumbComponent } from './component/thumb/thumb.component';
import { ImagePopupComponent } from './utils/image-popup/image-popup.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
  declarations: [
    SidebarComponent,
    HeaderComponent,
    FooterComponent,
    HomePageComponent,
    ImageListingComponent,
    UploadImageComponent,
    ThumbComponent,
    ImagePopupComponent
  ],
  imports: [
    ImageProcessorRouting,
    BrowserModule,
    CommonModule,
    NgbModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    BrowserAnimationsModule,
  ],
  exports: [
    SidebarComponent
  ],
  providers: [
    MatDialog,
  ]
})

export class ImageProcessorModule{

}
