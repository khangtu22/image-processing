import {Component, OnInit} from '@angular/core';
import {ImageService} from "../../sevices/image.service";
import {DataService} from "../../../service/data.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ImagePopupComponent} from "../../utils/image-popup/image-popup.component";
import {ImageTypeEnum} from "../../enum/image-type.enum";

@Component({
    selector: 'app-image-listing',
    templateUrl: './image-listing.component.html',
    styleUrls: ['./image-listing.component.scss']
})
export class ImageListingComponent implements OnInit {
    height: number;
    width: number;
    formGroup: FormGroup;
    imageUrls: any;
    errorMessage: string = '';
    selectedImages: string[] = [];
    private RESIZE_SUCCESS_MESSAGE = "Resize image successful!"
    private RESIZE_FAIL_MESSAGE = "Resize image fail!"

    constructor(private imageService: ImageService,
                private dataService: DataService,
                private formBuilder: FormBuilder,
                public dialog: MatDialog,
    ) {
        this.dataService.getSharedData().subscribe((data) => {
            if (data) {
                this.fetchImages();
            }
        });
        this.formGroup = this.formBuilder.group({
            height: ['', Validators.required],
            width: ['', Validators.required],
        });
    }

    openImagePopup(imageId): void {
        this.dialog.open(ImagePopupComponent, {
            data: {
                imageUrl: imageId.url,
                type: ImageTypeEnum.STOCK
            },
        });
    }

    ngOnInit() {
        this.fetchImages();
    }

    onSubmit() {
        this.resizeImage();
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

    isSelected(imageId: string): boolean {
        return this.selectedImages.includes(imageId);
    }

    fetchImages() {
        return this.imageService.getImages().subscribe(
            (response) => {
                this.imageUrls = response;
            },
            (error) => {
                this.errorMessage = error;
            }
        );
    }

    resizeImage() {
        this.imageService.resizeImage(this.formGroup.get('height').value, this.formGroup.get('width').value, this.selectedImages[0]).subscribe(result => {
            this.imageService.showSuccessToast(this.RESIZE_SUCCESS_MESSAGE);
            this.resetForm();
        }, error => {
            this.imageService.showFailToast(this.RESIZE_FAIL_MESSAGE);
        })
    }

    resetForm(): void {
        this.formGroup.reset();
        this.selectedImages = [];
    }

}
