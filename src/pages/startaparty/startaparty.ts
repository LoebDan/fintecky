import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController} from 'ionic-angular';

import { PartyProvider} from "../../providers/party/party";

import { AuthProvider } from '../../providers/auth/auth';

import firebase from 'firebase';

// import {PassrideschedPage} from "../passridesched/passridesched";
//
// import {DashboardPage} from "../dashboard/dashboard";

import {GetpartyidProvider} from "../../providers/getpartyid/getpartyid";

import { User } from '@firebase/auth-types';
import {ManageapartyPage} from "../manageaparty/manageaparty";
// import {CarddetailsPage} from "../carddetails/carddetails";

/**
 * Generated class for the StartapartyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-startaparty',
  templateUrl: 'startaparty.html',
})
export class StartapartyPage {
  public PartyID;
  CurrentPartyCode = {
    PartyCodeNow: ''
  };

  public Parties: firebase.database.Reference;
  currentUser: User;
  public userID: string;
  public userProfile: firebase.database.Reference;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
      public PartyProvider: PartyProvider,
      public authProvider: AuthProvider
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.Parties = firebase.database().ref(`/Parties/`);
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartapartyPage');
  }
//TopUp
  async getapartycode() {
    var PartyIDd = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    for (var i = 0; i < 10; i++) {
      PartyIDd += possible.charAt(Math.floor(Math.random() * possible.length));    }
    this.PartyID = PartyIDd;
    console.log (this.PartyID + "the party ID");
    this.PartyProvider.StartParty(this.PartyID);
    this.navCtrl.push(ManageapartyPage);
  }

async ionViewDidEnter(){

}

}

