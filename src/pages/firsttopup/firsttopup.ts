import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';

import { BalanceProvider } from "../../providers/balance/balance";

import { AuthProvider } from '../../providers/auth/auth';

import firebase from 'firebase';

import { FormBuilder, FormGroup } from "@angular/forms";

// import {CarddetailsPage} from "../carddetails/carddetails";

// import {DashboardPage} from "../dashboard/dashboard";

/**
 * Generated class for the FirsttopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-firsttopup',
  templateUrl: 'firsttopup.html',
})
export class FirsttopupPage {
  public UpdateBalanceForm: FormGroup;

  public Balance: any;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public BalanceProvider: BalanceProvider,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder,)
  {
    this.UpdateBalanceForm = formBuilder.group({
      TopUp: ['']
    });
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
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

    for (var i = 0; i < 10; i++) {
      TransID += possible.charAt(Math.floor(Math.random() * possible.length));
    };

    const userId: string = await firebase.auth().currentUser.uid;

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
     this.navCtrl.push('CarddetailsPage');
    });

  }

  topuplater(){
    this.navCtrl.push('DashboardPage');
  }


}

