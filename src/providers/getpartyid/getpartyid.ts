import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
// import { Reference } from '@firebase/database-types';
/*
  Generated class for the GetpartyidProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetpartyidProvider {
  public ViewPartyID: firebase.database.Reference;
  currentUser: User;
  public PartyID: firebase.database.Reference;

  public SumMembers: firebase.database.Reference;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        //this.ViewPartyID = firebase.database().ref(`/Parties/`);

        this.ViewPartyID = firebase.database().ref(`/userProfile/${user.uid}/PartyID`);

        //last night
        this.SumMembers = firebase.database().ref(`/Parties/${this.PartyID}/NumberOfMembers/`)
      } else {
        return;
      }
    });
  }

  fetchapartycode(): firebase.database.Reference {
    return this.ViewPartyID;

  }

  //last night
  getSumMembers(): firebase.database.Reference{
    return this.SumMembers;
  }

}
