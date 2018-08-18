import {Injectable} from '@angular/core';
import firebase from 'firebase';

import {User} from '@firebase/auth-types';

@Injectable()
export class ChartDataProvider {
  public clientProfile: firebase.database.Reference;
  public lineChartMonthData: Array<any>;
  public lineChartMonthLabels: Array<any>;
  public lineChartWeekData: Array<any>;
  public lineChartWeekLabels: Array<any>;

  public clientTransactions;
  public userTransactions: Array<any>;
  public transactionValues: Array<any>;
  public userBalance;

  myUID: User;

  public allTransactions: Array<any>; //pulls all txs

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.myUID = user;
        firebase.database().ref(`/Transactions/`).orderByChild('clientID').equalTo(this.myUID.uid).once('value', snap => {
          let Transactions = snap.val();
          for (const ob of Object.keys(snap.val())) {
            this.clientTransactions.push(Transactions[ob]);
            console.log(ob);
          }
        });
        console.log(this.clientTransactions);


        /*this.allTransactions = firebase.database().ref.child(`Transactions`).orderByChild('clientID').equalTo(`${this.myUID}`).on("value", function(snapshot) {
          console.log(snapshot.val());
          snapshot.forEach(function(data) {
            console.log(data.key);
          })
        })*/


      }
    })
  }


  fetchDaySums() {


  }


}
