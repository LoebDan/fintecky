import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserdataPage } from './userdata';

@NgModule({
  declarations: [
    UserdataPage,
  ],
  imports: [
    IonicPageModule.forChild(UserdataPage),
  ],
})
export class UserdataPageModule {}
