import { Injectable } from '@angular/core';
import firebase from 'firebase';


import { User } from '@firebase/auth-types';
// import { Reference } from '@firebase/database-types';

/*
  Generated class for the TopupProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TopupProvider {
  public topup: firebase.database.Reference;
  currentUser: User;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.topup = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

//function to retrieve and display information from the database
  topUp(): firebase.database.Reference {
    return this.topup;
  }
}

