import { Injectable } from '@angular/core';
import firebase from 'firebase';


import { User } from '@firebase/auth-types';
// import { Reference } from '@firebase/database-types';
/*
  Generated class for the PassengersProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PassengersProvider {
  pastRideOb;

  public PassengerScheduledRides: firebase.database.Reference;
  public userProfile: firebase.database.Reference;
  public userID: any;
  public PassengerID: string;
  public PassID: string;
  public DriverID: string;
  public PassRideID: string;
  public CarMake: string;
  public CarModel: string;
  public FirstName: string;
  public LicensePlate: string;
  public DriverRating: string;
  public DriverContactNo: string;
  public PassContactNo: string;
  public PassRating: string;
  public DriverRideID: string;
  why;

  currentUser: User;


  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.PassengerScheduledRides = firebase.database().ref(`/PassengerScheduledRides/`);
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }


  fetchPassengerSchedRides(): firebase.database.Reference {
    return firebase.database().ref(`/PassengerScheduledRides/`);
  }



  async PassSchedRide(startHub, endHub, startLoc, endloc, SchedDate, SchedTime, distance, basecost, partySize, startArea, endArea) {
    await this.userProfile.on('value', userProfileSnapshot => {
      var tempstring = '';
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      for (let i = 0; i < 10; i++) {
        tempstring += possible.charAt(Math.floor(Math.random() * possible.length));
      };
      this.userID = userProfileSnapshot.val();
      this.PassengerID = userProfileSnapshot.val().ID;
      this.FirstName = userProfileSnapshot.val().firstName;
      this.PassContactNo = userProfileSnapshot.val().ContactNo;
      this.PassRideID = this.PassengerID + "-" + tempstring;

      this.PassengerScheduledRides.child(this.PassRideID).set({
        PassUID: this.currentUser.uid,
        PassengerID: this.PassengerID,

        //PassengerBalance: this.userID.Balance,
        PassUserID: this.userID.Balance,
        PassFirstName: this.FirstName,
        PassContactNo: this.PassContactNo,
        PartySize: partySize,
        PassStartLocation: startLoc,
        PassEndLocation: endloc,
        DepartureTime: SchedTime,
        DepartureDate: SchedDate,
        BaseCost: basecost,
        Distance: distance,
        StartArea: startArea,
        EndArea: endArea,
        StartHub: startHub,
        EndHub: endHub
      });
    });
  }

  fetchPassengerSchedRidess(): firebase.database.Reference {
    return firebase.database().ref(`/Rides/`);
  }

  PassSchedRidee(rideObject){
    console.log(rideObject);
    var tempID = rideObject.RideID;
    console.log(tempID);
    firebase.database().ref(`/userProfile/${this.currentUser.uid}/rides/${tempID}`).update({
      RideID: tempID,
      Status: 'Awaiting Driver',
      Date: rideObject.RideDate
    });
    return firebase.database().ref(`/Rides/`).push(rideObject);
  }
}


