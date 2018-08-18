import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import {Events} from "ionic-angular";

/*
  Generated class for the PartyProvider provider.
  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PartyProvider {
  public userProfile: firebase.database.Reference;
  public PartyID: string;
  public userID:string;
  currentUser: User;
  public InParty: firebase.database.Reference;
  public Parties: firebase.database.Reference;




  constructor(public events: Events) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.InParty = firebase.database().ref(`/userProfile/${user.uid}/InParty`);
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.Parties = firebase.database().ref(`/Parties/`);


         }
    });
  }
  fetchParties(): firebase.database.Reference {
    return this.Parties;
  }



//function to retrieve and display information from the database
  async StartParty(PartyID){
    await this.userProfile.on('value', userProfileSnapshot => {
      this.InParty.set(PartyID);
      this.events.publish('user:party', true);
      firebase.database().ref(`/Parties/${PartyID}/NumberOfMembers/`).set(this.currentUser.uid);
    });

  }

  getmembers(PartyCode): firebase.database.Reference {
    return firebase.database().ref(`/Parties/${PartyCode}/NumberOfMembers`);
  }


}
