import { Component } from '@angular/core';
import {IonicPage, ViewController, NavParams, AlertController} from 'ionic-angular';

import { BalanceProvider } from "../../providers/balance/balance";

import { AuthProvider } from '../../providers/auth/auth';

import firebase from 'firebase';

import { FormBuilder, FormGroup } from "@angular/forms";
// import {CarddetailsPage} from "../carddetails/carddetails";



/**
 * Generated class for the QuicktopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-quicktopup',
  templateUrl: 'quicktopup.html',
})
export class QuicktopupPage {
  public UpdateBalanceForm: FormGroup;

  public Balance: any;
  CurrentBalance = {
    BalanceNow: ''
  };

  constructor(
    public navParams: NavParams,
    public view: ViewController,
    public alertCtrl: AlertController,
    public BalanceProvider: BalanceProvider,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder,)
  {
    this.UpdateBalanceForm = formBuilder.group({
      TopUp: ['']
    });
  }

  closeModal(){
    this.view.dismiss();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad QuicktopupPage');
  }

//this allows for the information retrieved from the database to be displayed
  ionViewDidEnter() {
    this.BalanceProvider.getViewBalance().on('value', userBalanceSnapshot => {
      this.Balance = userBalanceSnapshot.val();
    });
  }

//TopUp
  async enterCardDetails() {
    var TransID = "";

    var today = new Date();
    var TransDate =  today.toISOString();
    TransDate = TransDate.replace("T", " ");
    var TransDatee = TransDate.substring(0, TransDate.indexOf('.'));
    TransDate = TransDate.replace(/\..*/,'');


    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

    for (var i = 0; i < 10; i++) {
      TransID += possible.charAt(Math.floor(Math.random() * possible.length));
    };

    const userId: string = await firebase.auth().currentUser.uid;
    console.log(userId + ' userid');

    var OldBalance = Number(this.Balance);
    var TopUp = Number(this.UpdateBalanceForm.value.TopUp);
    var NewBalance = Number(OldBalance + TopUp);
    firebase
      .database()
      .ref(`/Transactions/${userId}/${TransID}`)
      .update({
        'TransactionDate': TransDatee,
        'TransactionType': 'Topped Up',
        'CreditAmount': TopUp
      });
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .update({
        Balance: NewBalance,
      }).then(() => {
      this.view.dismiss();
    });

  }




}
