import {Component, ElementRef, ViewChild} from '@angular/core';
import {ImageService} from "../../sevices/image.service";

@Component({
    selector: 'app-upload-image',
    templateUrl: './upload-image.component.html',
    styleUrls: ['./upload-image.component.scss']
})
export class UploadImageComponent {
    selectedFile: File | null = null;
    fd = new FormData();
    @ViewChild('imageInput')
    imageInput: ElementRef;

    constructor(private imageService: ImageService) {
    }

    createFormData(event): void {
        this.selectedFile = <File>event.target.files[0];
        this.fd.append('file', this.selectedFile, this.selectedFile.name);
    }

    uploadImage(event: Event): void {
        event.preventDefault();
        this.imageService.uploadImage(this.fd);
        this.resetForm();
    }

    resetForm(): void {
        this.imageInput.nativeElement.value = "";
        this.fd = new FormData();
        this.selectedFile = null;
    }
}
