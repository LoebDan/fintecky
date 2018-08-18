import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, ModalController} from 'ionic-angular';

import { BalanceProvider } from "../../providers/balance/balance";

import { AuthProvider } from '../../providers/auth/auth';

import firebase from 'firebase';

import { FormBuilder, FormGroup } from "@angular/forms";
 import {CarddetailsPage} from "../carddetails/carddetails";

/**
 * Generated class for the TopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


@IonicPage()
@Component({
  selector: 'page-topup',
  templateUrl: 'topup.html',
})

export class TopupPage {
  public UpdateBalanceForm: FormGroup;

  public Balance: any;
  CurrentBalance = {
    BalanceNow: ''
  };

  constructor(
    public navCtrl: NavController,
    public modal: ModalController,
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

    // var TransDate = new Intl.DateTimeFormat().format();  // var current = new
    // TransDate = TransDate.replace(/\//g, "-");
    // Intl.DateTimeFormat().format();

    var today = new Date();
    var TransDate =  today.toISOString();
    TransDate = TransDate.replace("T", " ");
    var TransDatee = TransDate.substring(0, TransDate.indexOf('.'));
    const userId: string = await firebase.auth().currentUser.uid;

    var OldBalance = Number(this.Balance);
    var TopUp = Number(this.UpdateBalanceForm.value.TopUp);
    var NewBalance = Number(OldBalance + TopUp);
    firebase
      .database()
      .ref(`/Transactions/${userId}/`)
      .push({
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
      let myModal = this.modal.create('CarddetailsPage');
      myModal.present();
    });

  }



}

