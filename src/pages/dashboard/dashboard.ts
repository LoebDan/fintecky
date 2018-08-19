import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  productsOnSpecial;
  displayProducts= [];
  productsInBudget;

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
  createTransaction(product) {
    let ref = firebase.database().ref(`/Transactions`);
    let productID = product.id
    let date = (new Date).getTime();
    let json ={
      "clientID" : this.myUID,
      "complete" : false,
      "id" : "aa",
      "merchantID" : product.merchant,
      "time" : date,
      "value" : product.price,
      "products" : {
        [productID]: {
          "id" : product.id
        }
      }
    };
    ref.push(json ).once('value', async snapshot => {
      let key = snapshot.key
      firebase.database().ref(`/Transactions/${key}/id`).set(key);
    });
   }
  placeOrder(product) {
    console.log(product);
    this.createTransaction(product);
    firebase.database().ref(`/Clients/${this.myUID}/balance`).once('value', async snapshot => {
      let temp = snapshot.val();
      temp -= product.price;
      firebase.database().ref(`/Clients/${this.myUID}/balance`).set(temp);
    });
  }

  

  getSpecials() {
    firebase.database().ref('/Products').orderByChild('special').equalTo('T').once('value', async snapshot => {
        this.productsOnSpecial = snapshot.val();
        this.displayProducts = [];
        for ( const ob of Object.keys(snapshot.val())) {
          this.displayProducts.push(this.productsOnSpecial[ob]);
          console.log(ob);
        }
        console.log(snapshot.val());
      }
    );
  }

  budgetProducts (budget) {
    budget = parseInt(budget)
    console.log("budget by " + budget + " type " + budget.type);
    firebase.database().ref('/Products').orderByChild('price').endAt(budget).once('value', async snapshot => {
       this.productsInBudget = snapshot.val();
        this.displayProducts = [];
        for ( const ob of Object.keys(snapshot.val())) {
          this.displayProducts.push(this.productsInBudget[ob]);
        }
         console.log('Products in Budget');
        console.log(this.displayProducts);
        //setTimeout(() => { this.loadingIndicator = false; }, 1500);
      }
    );

  }
}
