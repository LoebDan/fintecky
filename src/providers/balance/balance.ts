import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
/*
  Generated class for the BalanceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BalanceProvider {
  public ViewBalance: firebase.database.Reference;
  currentUser: User;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.ViewBalance = firebase.database().ref(`/userProfile/${user.uid}/Balance`);
      } else {
        return;
      }
    });
  }

//function to retrieve and display information from the database
  getViewBalance(): firebase.database.Reference {
    return this.ViewBalance;
  }

}
