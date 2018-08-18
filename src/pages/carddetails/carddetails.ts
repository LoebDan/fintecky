import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

// import { ViewbalanceandtransactionhistoryPage } from "../viewbalanceandtransactionhistory/viewbalanceandtransactionhistory";

/**
 * Generated class for the CarddetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-carddetails',
  templateUrl: 'carddetails.html',
})
export class CarddetailsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarddetailsPage');
  }

  submitCardDetails(){
    const alert = this.alertCtrl.create({
      title: 'Transaction Successful!',
      buttons: ['Okay'],
    });
    alert.present();
    this.navCtrl.push( 'ViewbalanceandtransactionhistoryPage');
  }


}


  //this.navCtrl.push(ViewbalanceandtransactionhistoryPage)
