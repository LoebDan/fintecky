import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';

/*
  Generated class for the NotificationsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationsProvider {

  currentUser: User;
  public DriverScheduledRides: firebase.database.Reference;
  public userProfile: firebase.database.Reference;
  notref: firebase.database.Reference;


  constructor() {
    console.log('Hello NotificationsProvider Provider');
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.DriverScheduledRides = firebase.database().ref(`/DriverScheduledRides/`);
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.notref = firebase.database().ref(`/userProfile/${user.uid}/Notifications`);
      }
      else{
        console.log("wait");
      }
    });
  }

  async PassSendRequest(RideOb, partySize){
    await this.userProfile.on('value', userProfileSnapshot => {
      var firstName = userProfileSnapshot.val().firstName;
      var PassUID = this.currentUser.uid;
      var DriverUID = RideOb.DriverUID;
      var notID = RideOb.DriverRideID + PassUID;
      console.log(this.currentUser + " current user");
      console.log(this.currentUser.uid + " current user");
      console.log(RideOb);
      console.log(notID);

      firebase.database().ref(`/userProfile/${DriverUID}/Notifications/${notID}`).set({
        Status: 'Pending',
        BaseCost: RideOb.BaseCost,
        Passenger: PassUID,
        FirstName: firstName,
        RideOb: RideOb,
        PartySize: partySize
      });

      firebase.database().ref(`/userProfile/${PassUID}/Requests/${notID}`).set({
        Status: 'Pending',
        BaseCost: RideOb.BaseCost,
        Driver: DriverUID,
        RideOb: RideOb
      });
    });
  }

  async DriverSendRequest(RideOb){
    await this.userProfile.once('value', userProfileSnapshot => {
      var firstName = userProfileSnapshot.val().firstName;
      var DriverUID = RideOb.DriverUID;

      var mems = RideOb.Members;
      var allmems = mems.split(",");
      var PassUID = allmems.splice(1);
      console.log(PassUID + " PassUID");
      var drivermem =  allmems.splice(allmems.indexOf(DriverUID),1);
      console.log(drivermem + " retrieving driver's uid");
      if(drivermem == DriverUID){
        // var notdriver = mems.replace(drivermem, "")
      };

      var notID = RideOb.DriverRideID + PassUID;
      console.log(notID + " notID");

      var rideid = RideOb.RideID;
      console.log(rideid + " rideid");

      // var custommessage = firstName + " has offered to be your driver for ride " + rideid;


      // for (let x of notdriver){
      //   var temppp = firebase.database().ref(`userProfile/${x}/Notifications/${notID}`).push({
      //     RideOb: RideOb,
      //     RideID: RideOb.RideID,
      //     Message: custommessage,
      //     notid: notID,
      //     Status: 'Unread',
      //     Date: RideOb.RideDate,
      //     BaseCost: RideOb.BaseCost,
      //     FirstName: firstName,
      //  //   Passenger: PassUID,
      //   });
      // }

    //  console.log(PassUID + "Pass UID");
      console.log(firstName + "firstName");

      // var DriverUID = this.currentUser.uid;
      // var notID = RideOb.DriverRideID + PassUID;
      console.log(this.currentUser + " current user");
      console.log(this.currentUser.uid + " current user");



      // firebase.database().ref(`/userProfile/${PassUID}/Notifications/${notID}`).set({
      //   Status: 'Pending',
      //   BaseCost: RideOb.BaseCost,
      //   Driver: DriverUID,
      //   RideOb: RideOb
      // });
    });
  }
   GetNots(): firebase.database.Reference {
    return this.notref;
  }

}
