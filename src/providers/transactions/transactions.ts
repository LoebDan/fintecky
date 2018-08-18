import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';

/*
  Generated class for the TransactionsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class TransactionsProvider {

  public PastTransactions: firebase.database.Reference;
  public userProfile: firebase.database.Reference;
  public ViewTransactions: firebase.database.Reference;
  currentUser: User;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if(user){
        this.currentUser = user;
        this.PastTransactions = firebase.database().ref(`/Transactions/${user.uid}`);
        this.ViewTransactions = firebase.database().ref(`/Transactions/${user.uid}`);
      }
    });
  }

 fetchTrans(): firebase.database.Reference{
   return this.PastTransactions;
 }
}


