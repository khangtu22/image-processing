import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {ImageService} from "../../sevices/image.service";

@Component({
    selector: 'app-image-popup',
    templateUrl: './image-popup.component.html',
    styleUrls: ['./image-popup.component.scss']
})
export class ImagePopupComponent implements OnInit {
    image: string | ArrayBuffer = null;

    @ViewChild('imageElement', {static: false}) imageElementRef!: ElementRef<HTMLImageElement>;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any, private imageService: ImageService) {
    }

    ngOnInit() {
        this.imageService.getImageByImageId(this.data.imageUrl, this.data.type).subscribe((data: ArrayBuffer) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    this.image = reader.result;
                    this.adjustImageContainerSize();
                };
                reader.readAsDataURL(new Blob([data]));
            },
            (error) => {
                console.error('Error fetching image:', error);
            });
    }

    adjustImageContainerSize() {
        if (this.imageElementRef && this.imageElementRef.nativeElement.complete) {
            const imageElement = this.imageElementRef.nativeElement;
            const containerElement = imageElement.parentElement;
            const imageAspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
            const containerAspectRatio = containerElement.offsetWidth / containerElement.offsetHeight;

            if (imageAspectRatio >= containerAspectRatio) {
                containerElement.style.height = `${containerElement.offsetWidth / imageAspectRatio}px`;
            } else {
                containerElement.style.width = `${containerElement.offsetHeight * imageAspectRatio}px`;
            }
        }
    }
}
