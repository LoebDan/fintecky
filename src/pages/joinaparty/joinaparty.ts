import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
// import {CarddetailsPage} from "../carddetails/carddetails";

import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { FormBuilder, FormGroup } from "@angular/forms";
import {PartyProvider} from "../../providers/party/party";
import {ManageapartyPage} from "../manageaparty/manageaparty";
/**
 * Generated class for the JoinapartyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-joinaparty',
  templateUrl: 'joinaparty.html',
})
export class JoinapartyPage {
  public JoinPartyForm: FormGroup;
  public userId;
  public userProfile: firebase.database.Reference;

  a;
  partyArray = [];



  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public PartyProvider: PartyProvider,
    formBuilder: FormBuilder,) {
    this.JoinPartyForm = formBuilder.group({
      PartyCode: ['']
    });
    this.userId = firebase.auth().currentUser.uid;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad JoinapartyPage');
    this.PartyProvider.fetchParties().on('value', partiesSnapshot => {
        var temp = partiesSnapshot.val();
        for (let juststring of Object.keys(temp)) {
          this.partyArray.push(juststring);
        }
      }
    );
  }
  async enterPartyCode() {
    var PartyCode = this.JoinPartyForm.value.PartyCode;
    const userId: string = await firebase.auth().currentUser.uid;
    this.PartyProvider.getmembers(PartyCode).once('value',partiesSnapshot => {
      var mems = partiesSnapshot.val();
      mems = mems + "," + userId;
      if (this.partyArray.some(x => x === PartyCode)) {
        firebase
          .database()
          .ref(`/Parties/${PartyCode}`)
          .update({
            'NumberOfMembers': mems,

          });

        firebase
          .database()
          .ref(`/userProfile/${userId}`)
          .update({
            'InParty': PartyCode,
          }).then(() => {
          this.navCtrl.push(ManageapartyPage);
        });
      }
      else {
        const alert = this.alertCtrl.create({
          title: 'Invalid Party ID',
          buttons: ['Okay'],
        });
        alert.present();
      }
    });
  }
}
