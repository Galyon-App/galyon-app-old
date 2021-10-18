import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CropperRoutingModule } from './cropper-routing.module';
import { CropperComponent } from '../cropper/cropper.component';
import { ImageCropperModule } from 'ngx-image-cropper';


@NgModule({
  declarations: [CropperComponent],
  imports: [
    CommonModule,
    CropperRoutingModule,
    ImageCropperModule
  ]
})
export class CropperModule { }
