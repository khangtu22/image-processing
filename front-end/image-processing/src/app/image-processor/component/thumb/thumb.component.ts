import {Component, OnInit} from '@angular/core';
import {ImageService} from "../../sevices/image.service";
import {ImagePopupComponent} from "../../utils/image-popup/image-popup.component";
import {MatDialog} from "@angular/material/dialog";
import {ImageTypeEnum} from "../../enum/image-type.enum";
import {Subscription} from "rxjs";

@Component({
    selector: 'app-thumb',
    templateUrl: './thumb.component.html',
    styleUrls: ['./thumb.component.scss']
})
export class ThumbComponent implements OnInit {
    imageUrls: any;
    errorMessage: string;
    selectedImages: string[] = [];

    constructor(private imageService: ImageService,
                public dialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.fetchImages();
    }

    isSelected(imageId: string): boolean {
        return this.selectedImages.includes(imageId);
    }

    handleImageSelectionOnCardClick(imageId): void {
        if (!this.selectedImages.includes(imageId.id)) {
            // If the clicked image is not already in the selectedImages array,
            // clear the array and select the clicked image only.
            this.selectedImages = [imageId.id];
            this.openImagePopup(imageId)
        } else {
            // If the clicked image is already in the selectedImages array,
            // deselect it by removing it from the array.
            this.selectedImages = this.selectedImages.filter((id) => id !== imageId.id);
        }
    }

    openImagePopup(imageId): void {
        this.dialog.open(ImagePopupComponent, {
            data: {
                imageUrl: imageId.url,
                type: ImageTypeEnum.THUMB
            }
        });
    }

    fetchImages(): Subscription {
        return this.imageService.getTransformedImages().subscribe(
            (response) => {
                this.imageUrls = response;
            },
            (error) => {
                this.errorMessage = error;
            }
        );
    }
}
