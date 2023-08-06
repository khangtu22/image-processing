import {EventEmitter, Injectable, Input, Output} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from "ngx-toastr";
import {DataService} from "../../service/data.service";
import {ImageTypeEnum} from "../enum/image-type.enum";

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private STOCK_IMAGES = 'http://localhost:3000/images';
  private TRANSFORMED_IMAGES = 'http://localhost:3000/transformed-images';
  private baseLocalHost = 'http://localhost:3000';
  private UPLOAD_SUCCESS_MESSAGE = "Upload image successful!"
  private UPLOAD_FAIL_MESSAGE = "Upload image fail!"

  @Input() data: any;
  @Output() onDataChange = new EventEmitter<any>();
  constructor(private http: HttpClient, private toastr: ToastrService, private dataService: DataService) {}

  getImages() {
    return this.http.get<string[]>(this.STOCK_IMAGES);
  }
  getTransformedImages() {
    return this.http.get<string[]>(this.TRANSFORMED_IMAGES);
  }

  resizeImage(height: number, width: number, filename: string){
    return this.http.get(this.baseLocalHost + `/api/image?height=${height}&width=${width}&imageId=${filename}`);
  }

  getImageByImageId(filename: string, imageType: ImageTypeEnum) {
    if (imageType === ImageTypeEnum.STOCK){
      return this.http.get(this.baseLocalHost + `/image/stock?imageId=${filename}`, { responseType: 'arraybuffer' });
    } else if (imageType === ImageTypeEnum.THUMB){
      return this.http.get(this.baseLocalHost + `/image/thumb?imageId=${filename}`, { responseType: 'arraybuffer' });
    } else {
      return null;
    }
  }

  uploadImage(formData: FormData){
    return this.http.post(this.baseLocalHost + "/upload", formData)
        .subscribe( result => {
          this.showSuccessToast(this.UPLOAD_SUCCESS_MESSAGE);
          this.dataService.updateSharedData(true);
        }, error => {
          this.showFailToast(this.UPLOAD_FAIL_MESSAGE);
        });
  }
  showSuccessToast(messageSuccess: string) {
    this.toastr.success(messageSuccess, 'Success', {
      closeButton: false,
      timeOut: 3000, // Duration in milliseconds
      progressBar: true,
      positionClass: 'toast-top-right' // You can set other positions too, like 'toast-top-left', 'toast-bottom-right', etc.
    });
  }

  showFailToast(messageFail: string) {
    this.toastr.error(messageFail, 'Error', {
      closeButton: false,
      timeOut: 3000, // Duration in milliseconds
      progressBar: true,
      positionClass: 'toast-top-right' // You can set other positions too, like 'toast-top-left', 'toast-bottom-right', etc.
    });
  }

}
