import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { User } from '@firebase/auth-types';
// import {NavController} from "ionic-angular";
// import { Reference } from '@firebase/database-types';

/*
  Generated class for the DriversProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DriversProvider {
  pastRideOb;

  public DriverScheduledRides: firebase.database.Reference;
  public userProfile: firebase.database.Reference;
  public userID: any;
  public PassID: string;
  public DriverID: string;
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
        this.DriverScheduledRides = firebase.database().ref(`/DriverScheduledRides/`);
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
      }
    });
  }

   fetchDriverSchedRides(): firebase.database.Reference {
    return firebase.database().ref(`/DriverScheduledRides/`);
  }

  async schedRide(startHub, endHub, startLoc, endloc, NoAvailSeats, SchedDate, SchedTime, distance, startArea, endArea){
    await this.userProfile.on('value', userProfileSnapshot => {
      var DriverUID = this.currentUser.uid;
      var tempstring = '';
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      for (var i = 0; i < 10; i++) {
        tempstring += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      this.DriverID = userProfileSnapshot.val().DriverID;
      this.CarModel = userProfileSnapshot.val().CarModel;
      this.FirstName = userProfileSnapshot.val().firstName;
      this.CarMake = userProfileSnapshot.val().CarMake;
      this.DriverContactNo = userProfileSnapshot.val().ContactNo;
      this.LicensePlate = userProfileSnapshot.val().CarModel;
      var DriverRideID = this.DriverID + "-" + tempstring;
      console.log(DriverRideID + " DriverRideID");

      this.DriverScheduledRides.child(DriverRideID).set({
        DriverRideID: DriverRideID,
        DriverUID: DriverUID,
        DriverID : this.DriverID,
        CarMake : this.CarMake,
        CarModel: this.CarModel,
        Members: DriverUID,
        DriverFirstName : this.FirstName ,
        DriverContactNo: this.DriverContactNo,
        LicensePlate: this.LicensePlate,
        DriverStartLocation: startLoc,
        DriverEndLocation: endloc,
        DepartureTime: SchedTime,
        AvailSeats: NoAvailSeats,
        DepartureDate: SchedDate,
        Distance: distance,
        StartArea: startArea,
        EndArea: endArea,
        StartHub: startHub,
        EndHub: endHub
      });
    });
  }
}

