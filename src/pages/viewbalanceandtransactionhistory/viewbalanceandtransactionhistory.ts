import { Component } from '@angular/core';
import {
  NavParams,
  IonicPage,
  NavController
} from 'ionic-angular';
import { TransactionsProvider } from "../../providers/transactions/transactions";
import { BalanceProvider } from "../../providers/balance/balance";
import { AuthProvider } from '../../providers/auth/auth';
import {TopupPage} from "../topup/topup";
import firebase from 'firebase';


/**
 * Generated class for the ViewbalanceandtransactionhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewbalanceandtransactionhistory',
  templateUrl: 'viewbalanceandtransactionhistory.html',
})
export class ViewbalanceandtransactionhistoryPage {
  public userId;
  AllpastTransOb = {};
  pastTransArray = [];
  public userProfile: firebase.database.Reference;
  public Balance: any;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public TransactionsProvider: TransactionsProvider,
    public BalanceProvider: BalanceProvider)
  {
    this.BalanceProvider.getViewBalance().on('value', userBalanceSnapshot => {
      this.Balance = userBalanceSnapshot.val();
      console.log(this.Balance);
    });
  }


  ionViewDidLoad(){
    this.TransactionsProvider.fetchTrans().on('value', async hubdataSnapshot => {
      this.AllpastTransOb = await hubdataSnapshot.val();
      //Here you get an object back that contains every transaction of the user
      for(let key of Object.keys(this.AllpastTransOb)){
        //  Then you say for every key within the object run these lines (so run for each transaction ID)
        this.pastTransArray.push(this.AllpastTransOb[key]);
        // You have now added each transaction as its own object into the array of transaction objects
        // then in the HTML you run a loop that asks for each object in the array and then you call object.oneOfitsProperties
      }
    });
  }

  //Withdraw credits button taking user to Withdraw page
  topUp() {
    this.navCtrl.push(TopupPage);
  }

}





