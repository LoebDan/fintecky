import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the ContactusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contactus',
  templateUrl: 'contactus.html',
})
export class ContactusPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactusPage');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Thank You',
      subTitle: 'Your message has been submitted. A CarPoGo staff member will view and respond to your enquiry. Thank you for your interest.',
      buttons: ['OK'],
      cssClass: 'alertCustomCss'
    });
    alert.present();
  }

}
