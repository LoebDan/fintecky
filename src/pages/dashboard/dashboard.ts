import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import firebase from 'firebase';
import {AuthProvider} from "../../providers/auth/auth";

/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('directionsPanel') directionsPanel: ElementRef;
  map: any;

  public  Read = [];
  Unread = [];
  NotOb;

  myUID = 'asdadUID';
  merchant = {name : 'Jeff\'s Place'};
  productsOnSpeciall;
  productsOnSpecial = [];
  productsInBudgett;
  productsInBudget = [];

  RideOb = {};
  RidesArray = [];
  location: {
    latitude: number,
    longitude: number
  };

  public Balance: any;
  public userProfile: firebase.database.Reference;
  currentUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
  )
  {
    this.getSpecials();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log(user.uid);
        console.log(user + " user");

        this.currentUser = user.uid;
      }
      else {
        this.authProvider.logoutUser().then(() => {
          this.navCtrl.setRoot('LoginPage');
        });
      }
    });
  }

  async ionViewDidLoad(){
    this.location = {
      latitude: -33.9321,
      longitude: 18.8601
    };
    await this.delay(3000).then(() => {
      this.testcall();
    });
  }

  getNots(){
    firebase.database().ref(`/userProfile/${this.currentUser}/Notifications`).on('value', async NotSnapshot => {
      this.Read = [];
      this.Unread = [];
      console.log(this.currentUser + " not");
      this.NotOb = NotSnapshot.val();
      var ob = NotSnapshot.val();
      if (ob != null) {
        for (let x of Object.keys(ob)) {
          if (this.NotOb[x].Status == "Read") {
            this.Read.push(this.NotOb[x]);
          }
          if (this.NotOb[x].Status == "Unread") {
            this.Unread.push(this.NotOb[x]);
          }
        }
      }
    });
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async testcall(){

  }

  placeOrder(product) {
    console.log(product);

    firebase.database().ref(`/Clients/${this.myUID}/balance`).once('value', async snapshot => {
      let temp = snapshot.val();
      temp -= product.price;
      firebase.database().ref(`/Clients/${this.myUID}/balance`).set(temp);
    });
  }

  getSpecials() {
    firebase.database().ref('/Products').orderByChild('special').equalTo('T').once('value', async snapshot => {
        this.productsOnSpeciall = snapshot.val();
        for ( const ob of Object.keys(snapshot.val())) {
          this.productsOnSpecial.push(this.productsOnSpeciall[ob]);
          console.log(ob);
        }
        console.log(snapshot.val());
        //setTimeout(() => { this.loadingIndicator = false; }, 1500);
      }
    );
  }

  budgetProducts (budget) {
    firebase.database().ref('/Products').orderByChild('price').endAt(budget).once('value', async snapshot => {
        this.productsInBudgett = snapshot.val();
        for ( const ob of Object.keys(snapshot.val())) {
          this.productsInBudget.push(this.productsInBudgett[ob]);
          console.log('Products in Budget');
          console.log(ob);
        }
        //setTimeout(() => { this.loadingIndicator = false; }, 1500);
      }
    );

  }
}
