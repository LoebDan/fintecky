import { Component } from '@angular/core';
import {
  NavParams,
  IonicPage,
  NavController,
  ModalController
} from 'ionic-angular';
import {PassengersProvider} from "../../providers/passengers/passengers";
import { AuthProvider } from '../../providers/auth/auth';
import {PartyProvider} from "../../providers/party/party";
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
import {DashboardPage} from "../dashboard/dashboard";
import {PartyschedridePage} from "../partyschedride/partyschedride";

/**
 * Generated class for the ManageapartyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-manageaparty',
  templateUrl: 'manageaparty.html',
})
export class ManageapartyPage {

  public PartyID;


  currentUser: User;

  public userProfile: firebase.database.Reference;

  partyArray: any = [];
  public leader: any;


  FirstNames = [];


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public PartyProvider: PartyProvider,
    public PassengersProvider: PassengersProvider,
    public modal: ModalController,
  ) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        firebase.database().ref(`/userProfile/${user.uid}/InParty`).on('value' , snap => {
          this.PartyID = snap.val();
        });
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);

      }
    });
  }


//Getting Party Leader ID
  ionViewDidLoad() {
    console.log('ionViewDidLoad ManageapartyPage');
    this.PartyProvider.fetchParties().on('value', partiesSnapshot => {
        var temp = partiesSnapshot.val();
        for (let juststring of Object.keys(temp)) {
          this.partyArray.push(juststring);
        }
      }
    );
  }


//Getting Party Leader ID
 async ionViewDidEnter(){
    console.log (this.partyArray);
    console.log(this.PartyID + "Party ID");

    var PartyCode = this.PartyID;


    const userId: string = await firebase.auth().currentUser.uid;
    this.PartyProvider.getmembers(PartyCode).once('value',partiesSnapshot => {
      var mems = partiesSnapshot.val();

      //retrieving the party leader's uid from the array
      var leadermem = mems.split(",", 1);

      //update party size based on number of members in the party
      var nummems = leadermem.length;

      //retrieving all the members' uid
      var allmems = mems.split(",");

      //To enable the button depending on whether they're the leader
      if (userId == leadermem) {
        this.leader = 1
      } else {
        this.leader = 0
      }

      console.log(this.leader + " To check if user is leader")

      // // // Getting the names of all the party members
      for (let x of allmems){
        firebase.database().ref(`userProfile/${x}/firstName`).on('value', partiesSnapshot => {
          var tempp = partiesSnapshot.val();
          this.FirstNames.push(tempp);
          console.log(this.FirstNames + " First names of all the members")
        });

      }
    });

  }

  getaride(){
    //this.navCtrl.push(PassrideschedPage)
    let myModal = this.modal.create(PartyschedridePage);
    myModal.present();
  }

  async disbandparty(){

    var PartyCode = this.PartyID;

    // const userId: string = await firebase.auth().currentUser.uid;
    this.PartyProvider.getmembers(PartyCode).once('value',partiesSnapshot => {
      var mems = partiesSnapshot.val();

      //retrieving all the members' uid
      var allmems = mems.split(",");

      // // Getting the names of all the party members
      for (let x of allmems){
        firebase.database()
          .ref(`userProfile/${x}`)
          .update({
          'InParty': "No",
        });

        firebase
          .database()
          .ref(`/Parties/${PartyCode}`)
          .update({
            'NumberOfMembers': 0,
          });
      }

    });

  }

  async exitparty(){
    const userID: string = await firebase.auth().currentUser.uid;

    var PartyCode = this.PartyID;


    this.PartyProvider.getmembers(PartyCode).on('value',partiesSnapshot => {

      var mems = partiesSnapshot.val();

      //retrieving all the members' uid
      var allmems = mems.split(",");

      //retrieving the current user's uid from the list
      var removedmem =  allmems.splice(allmems.indexOf(userID),1);

      //Condition
      if (removedmem == userID){

       // var mems = mems.replace(removedmem, "");

       firebase
          .database()
          .ref(`/Parties/${PartyCode}`)
          .update({
            'NumberOfMembers': mems,
          });

       firebase
         .database()
         .ref(`/userProfile/${userID}`)
         .update({
           InParty: "No",
         }).then(() => {
         this.navCtrl.push(DashboardPage);
       });


      }else{
      console.log("does not belong in party");
      }


    })


  };



}

