import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResetRoutingModule } from './reset-routing.module';
import { ResetComponent } from './reset.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgOtpInputModule } from 'ng-otp-input';
@NgModule({
  declarations: [ResetComponent],
  imports: [
    CommonModule,
    ResetRoutingModule,
    SharedModule,
    NgOtpInputModule
  ]
})
export class ResetModule { }
