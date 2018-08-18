import { Injectable } from '@angular/core';
import firebase from 'firebase';


import { User } from '@firebase/auth-types';
// import { Reference } from '@firebase/database-types';
/*
  Generated class for the RidesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RidesProvider {
  public userProfile: firebase.database.Reference;
  public DriverID: string;
  public CarMake: string;
  public CarModel: string;
  public FirstName: string;
  public LicensePlate: string;
  public DriverContactNo: string;
  currentUser: User;

  public PastRides: firebase.database.Reference;

  constructor() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.currentUser = user;
        this.userProfile = firebase.database().ref(`/userProfile/${user.uid}`);
        this.PastRides = firebase.database().ref(`/userProfile/${user.uid}/rides`);
      }
    });
  }

  fetchSchedRidess(): firebase.database.Reference {
    return firebase.database().ref(`/Rides/`);
  }


  SchedRidee(rideObject) {
    firebase.database().ref(`/userProfile/${this.currentUser.uid}`).once('value', async userProfileSnapshot => {
      var Balance = userProfileSnapshot.val().Balance;
      var newBalance = Balance - rideObject.BaseCost;
      return firebase.database().ref(`/Rides/`).push(rideObject).then((snap) => {
        const RideID = snap.key;
        firebase.database().ref(`/userProfile/${this.currentUser.uid}/rides/${RideID}`).update({
          RideID: RideID,
          Status: 'waiting',
          Date: rideObject.RideDate,
          Role: 'Passenger'
        });
        firebase.database().ref(`/Rides/${RideID}/`).update({
          RideID: RideID,
        });
        firebase.database().ref(`/userProfile/${this.currentUser.uid}/Notifications/${RideID}`).set({
          NoticeID: RideID,
          Status: 'Unread',
          Date: rideObject.RideDate,
          message: 'You requested a driver for Ride :' + RideID,
          Submessage: 'We have reserved ' + rideObject.BaseCost + " Credits from your account"
        });
        firebase.database().ref(`/Transactions/${this.currentUser.uid}`).push({
          CreditAmount: rideObject.BaseCost,
          TransactionDate: rideObject.RideDate,
          TransactionType: 'Reserved: ',
          RideID: RideID
        });
        firebase
          .database()
          .ref(`/userProfile/${this.currentUser.uid}`)
          .update({
            Balance: newBalance,
            Reserved: rideObject.BaseCost
          })
      });
    });
  }

  // Driver
  DriverSchedRidee(rideObject) {
    console.log(rideObject);
    var tempID = rideObject.RideID;
    console.log(tempID);
    return firebase.database().ref(`/Rides/`).push(rideObject).then((snap) => {
      const RideID = snap.key;
      firebase.database().ref(`/userProfile/${this.currentUser.uid}/rides/${RideID}`).update({
        RideID: RideID,
        Status: 'Pending',
        Date: rideObject.RideDate,
        Role: 'Driver'
      });
      var notID = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
      for (var i = 0; i < 10; i++) {
        notID += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      firebase.database().ref(`/userProfile/${this.currentUser.uid}/Notifications/${RideID}`).set({
        NoticeID: notID ,
        Status: 'Unread',
        Date: rideObject.RideDate,
        message: 'You scheduled to be a driver for Ride :' + RideID
      });
      firebase.database().ref(`/Rides/${RideID}/`).update({
        RideID: RideID,
      });
    });
  }

  async DriverStartRide(RideOb) {
    await this.userProfile.once('value', userProfileSnapshot => {
      console.log(this.currentUser.uid);
      if(userProfileSnapshot != null && userProfileSnapshot != undefined) {
        this.DriverID = userProfileSnapshot.val().DriverID;
        this.CarModel = userProfileSnapshot.val().CarModel;
        this.FirstName = userProfileSnapshot.val().firstName;
        this.CarMake = userProfileSnapshot.val().CarMake;
        this.DriverContactNo = userProfileSnapshot.val().ContactNo;
        this.LicensePlate = userProfileSnapshot.val().CarModel;
        var mems = RideOb.Members;
        var allmems = mems.split(",");
        console.log(allmems + " The uids of all the members");
        if(RideOb.RideID != null && RideOb.RideID != undefined){
          for (let x of allmems){
            firebase.database().ref(`userProfile/${x}/rides/${RideOb.RideID}`).update({
              Status:'In Progress',
            });
            firebase.database().ref(`/userProfile/${x}/Notifications/${RideOb.RideID}`).update({
              NoticeID: RideOb.RideID ,
              Status: 'Unread',
              Date: RideOb.RideDate,
              message: 'Ride Has started :' + RideOb.RideID,
              RideID: RideOb.RideID
            });
          }
          firebase.database().ref(`/Rides/${RideOb.RideID}`).update({
            Status: 'In Progress',
            TotalReceived: RideOb.TotalReceived,
          });
        }

      }
    });
  }

  async DriverEndRide(RideOb) {
    await this.userProfile.once('value', userProfileSnapshot => {
      console.log(this.currentUser.uid);
      if(userProfileSnapshot != null && userProfileSnapshot != undefined) {
        this.DriverID = userProfileSnapshot.val().DriverID;
        this.CarModel = userProfileSnapshot.val().CarModel;
        this.FirstName = userProfileSnapshot.val().firstName;
        this.CarMake = userProfileSnapshot.val().CarMake;
        this.DriverContactNo = userProfileSnapshot.val().ContactNo;
        this.LicensePlate = userProfileSnapshot.val().CarModel;
        var mems = RideOb.Members;
        var allmems = mems.split(",");
        console.log(allmems + " The uids of all the members");
        if(RideOb.RideID != null && RideOb.RideID != undefined){
          for (let x of allmems){
            if(x == RideOb.DriverUID){
              firebase.database().ref(`/userProfile/${x}`).once('value', async DriverSnapshot => {

                var partySize = allmems.length - 1;
                var Balance = Number(DriverSnapshot.val().Balance);
                let pay = (Math.floor(Number(RideOb.Distance) / 1000 * 1.2)) * ((21 - partySize) / 20);
                var receive = pay * (partySize);
                Balance = (Balance + receive);
                firebase.database().ref(`userProfile/${x}/rides/${RideOb.RideID}`).update({
                  Status:'Ride Has Ended',
                });
                firebase.database().ref(`userProfile/${x}`).update({
                  Balance: Balance
                });
                firebase.database().ref(`/Transactions/${x}`).push({
                  CreditAmount: receive,
                  TransactionDate: RideOb.RideDate,
                  TransactionType: 'Received: ',
                  RideID: RideOb.RideID
                });
                firebase.database().ref(`/userProfile/${x}/Notifications/${RideOb.RideID}`).update({
                  NoticeID: RideOb.RideID ,
                  Status: 'Unread',
                  Date: RideOb.RideDate,
                  message: 'Received: ' + receive,
                  RideID: RideOb.RideID
                });
              });
            }
            else{
              firebase.database().ref(`/userProfile/${x}`).once('value', async Snapshot => {
                var Res = Snapshot.val().Reserved;
                var partySize = allmems.length - 1;
                var Balance = Snapshot.val().Balance;
                console.log(Balance + " Balance before");

                let pay = (Math.floor(Number(RideOb.Distance) / 1000 * 1.2)) * ((21 - partySize) / 20);
                console.log(pay + " pay");
                Balance = (Balance + (RideOb.BaseCost - pay));
                console.log(Balance + " Balance after");
                Res = Res - RideOb.BaseCost;
                console.log(Res + " res");
                firebase.database().ref(`userProfile/${x}/rides/${RideOb.RideID}`).update({
                  Status:'Ride Has Ended',
                });
                firebase.database().ref(`userProfile/${x}`).update({
                  Balance: Balance,
                  Reserved: Res
                });
                firebase.database().ref(`/Transactions/${x}`).push({
                  CreditAmount: pay,
                  TransactionDate: RideOb.RideDate,
                  TransactionType: 'Paid: ',
                  RideID: RideOb.RideID
                });
                firebase.database().ref(`/userProfile/${x}/Notifications/${RideOb.RideID}`).update({
                  NoticeID: RideOb.RideID ,
                  Status: 'Unread',
                  Date: RideOb.RideDate,
                  message: 'Paid: ' + pay,
                  RideID: RideOb.RideID
                });
              })
            }
          }
          var partySize = allmems.length - 1;
          let pay = (Math.floor(Number(RideOb.Distance) / 1000 * 1.2)) * partySize * ((21 - partySize) / 20) / (partySize);
          var receive = pay * (partySize);
          firebase.database().ref(`/Rides/${RideOb.RideID}`).update({
            Status: 'Ride Has Ended',
            TotalReceived: receive,
          });
        }
      }
    });
  }

  async DriverJoined(RideOb, AvailSeats) {
    await this.userProfile.once('value', userProfileSnapshot => {
      console.log(this.currentUser.uid);
      if(userProfileSnapshot != null && userProfileSnapshot != undefined) {
        this.DriverID = userProfileSnapshot.val().DriverID;
        this.CarModel = userProfileSnapshot.val().CarModel;
        this.FirstName = userProfileSnapshot.val().firstName;
        this.CarMake = userProfileSnapshot.val().CarMake;
        this.DriverContactNo = userProfileSnapshot.val().ContactNo;
        this.LicensePlate = userProfileSnapshot.val().CarModel;
        var mems = RideOb.Members;
        mems = mems.replace('Waiting for a driver', this.currentUser.uid);
        var memsnames = RideOb.MemberFirstNames;
        memsnames = memsnames.replace('Waiting for a driver', this.FirstName);
        console.log(mems + " this is the names of the members after driver has entered");
        var allmems = mems.split(",");
        console.log(allmems + " The uids of all the members");
        if(RideOb.RideID != null && RideOb.RideID != undefined){
          for (let x of allmems){
            firebase.database().ref(`userProfile/${x}/rides/${RideOb.RideID}`).update({
              RideID: RideOb.RideID,
              Status: 'Pending',
              Date: RideOb.RideDate,
            });
            firebase.database().ref(`/userProfile/${x}/Notifications/${RideOb.RideID}`).set({
              NoticeID: RideOb.RideID ,
              Status: 'Unread',
              Date: RideOb.RideDate,
              message: 'There was a match! :' + RideOb.RideID
            });
          }
          firebase.database().ref(`/Rides/${RideOb.RideID}`).update({
            RideID: RideOb.RideID,
            DriverUID: this.currentUser.uid,
            DriverID: this.DriverID,
            CarMake: this.CarMake,
            CarModel: this.CarModel,
            Members: mems,
            MemberFirstNames: memsnames,
            DriverFirstName: this.FirstName,
            DriverContactNo: this.DriverContactNo,
            LicensePlate: this.LicensePlate,
            DriverStartLocation: RideOb.DriverStartLocation,
            DriverEndLocation: RideOb.DriverEndLocation,
            DepartureTime: RideOb.DepartureTime,
            AvailSeats: AvailSeats,
            DepartureDate: RideOb.DepartureDate,
            Distance: RideOb.Distance,
            StartArea: RideOb.StartArea,
            EndArea: RideOb.EndArea,
            StartHub: RideOb.StartHub,
            EndHub: RideOb.EndHub,
            Status: 'Pending',
            TotalReceived: "ActiveRide",
            RideDate: RideOb.RideDate,
            BaseCost: RideOb.BaseCost
          });
        }
      }
    });
  }
  fetchrides(): firebase.database.Reference{
    return this.PastRides;
  }
}
