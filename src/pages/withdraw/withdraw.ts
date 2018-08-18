import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { BalanceProvider } from "../../providers/balance/balance";
import { AuthProvider } from '../../providers/auth/auth';
import firebase from 'firebase';
import { FormBuilder, FormGroup } from "@angular/forms";
 import {CarddetailsPage} from "../carddetails/carddetails";




/**
 * Generated class for the WithdrawPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-withdraw',
  templateUrl: 'withdraw.html',
})
export class WithdrawPage {

  public UpdateBalanceForm: FormGroup;

  public Balance;
  // CurrentBalance = {
  //   BalanceNow: ''
  // };

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public BalanceProvider: BalanceProvider,
    public modal: ModalController,
    public authProvider: AuthProvider,
    formBuilder: FormBuilder,
    public navParams: NavParams) {

    this.UpdateBalanceForm = formBuilder.group({
      Withdraw: ['']
    });
  }

//this allows for the information retrieved from the database to be displayed
  ionViewDidEnter() {
    this.BalanceProvider.getViewBalance().on('value', userBalanceSnapshot => {
      this.Balance = userBalanceSnapshot.val();
      console.log(this.Balance + " Bal");
    });
  }

//TopUp
  async enterCardDetails() {

    var today = new Date();
    var TransDate =  today.toISOString();
    TransDate = TransDate.replace("T", " ");
    var TransDatee = TransDate.substring(0, TransDate.indexOf('.'));
    var TTransDate = TransDate.replace(/\.*/,'');
    console.log(TransDatee);
    console.log(TTransDate);


    // var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";

    // for (var i = 0; i < 10; i++) {
    //   var TransID = "";
    //   TransID += possible.charAt(Math.floor(Math.random() * possible.length));
    // };

    const userId: string = await firebase.auth().currentUser.uid;
    console.log(userId + ' userid');

    var OldBalance = Number(this.Balance);
    var Withdraw = Number(this.UpdateBalanceForm.value.Withdraw);
    var NewBalance = Number(OldBalance - Withdraw - 100);
    console.log(NewBalance + "Newbalance");
    if (NewBalance == 0 || NewBalance > 0){
      firebase
        .database()
        .ref(`/Transactions/${userId}/`)
        .push({
          'TransactionDate': TransDatee,
          'TransactionType': 'Withdrew',
          'CreditAmount': Withdraw
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
    }else{
      const alert = this.alertCtrl.create({
        title: 'Transaction was unsuccessful due to insufficient withdrawal amount.',
        buttons: ['Okay'],
      });
      alert.present();
      this.navCtrl.push( 'ViewbalanceandtransactionhistoryPage');
    }
  }
}









