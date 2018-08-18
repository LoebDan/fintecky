import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DriverPickUpPassengerPage } from './driver-pick-up-passenger';
/**new toast*/
import { ToastController } from 'ionic-angular';

@NgModule({
  declarations: [
    // DriverPickUpPassengerPage,
  ],
  imports: [
    IonicPageModule.forChild(DriverPickUpPassengerPage),
  ],
})
export class DriverPickUpPassengerPageModule {constructor(
  public toastCtrl: ToastController) {
  }

  showToastWithCloseButton() {
    let toast = this.toastCtrl.create({
      message: 'You have successfully applied to be the driver for this ride. Awaiting confirmation from passenger.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }
}



