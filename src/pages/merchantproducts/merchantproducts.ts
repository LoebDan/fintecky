import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {  NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the DashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-merchantproducts',
  templateUrl: 'merchantproducts.html',
})
export class MerchantproductsPage {


  public  Read = [];
  Unread = [];
  NotOb;
  merchant = "";
  productsOnSpecial;
  displayProducts= [];
  productsInBudget;
  productsOfMerchant;

  public Balance: any;
  public userProfile: firebase.database.Reference;
  currentUser;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
  )
  {
    this.merchant = navParams.get('data');

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
    this.getProducts();
    await this.delay(1000).then(() => {
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
    let UID = firebase.auth().currentUser.uid;
    let json ={
      "clientID" : UID,
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
    let storeKey;
    ref.push(json ).once('value', async snapshot => {
      
       storeKey = snapshot.key
      firebase.database().ref(`/Transactions/${storeKey}/id`).set(storeKey);
    });
    let data = {[storeKey]: {
      "id" : storeKey
    }}
    firebase.database().ref(`/Clients/${UID}/transactions`).update(data);
    firebase.database().ref(`/Merchants/${product.merchant}/transactions`).update(data);
    console.log(UID)
   }
  placeOrder(product) {
    console.log(product);
    let UID = firebase.auth().currentUser.uid;

    this.createTransaction(product);
    firebase.database().ref(`/Clients/${UID}/balance`).once('value', async snapshot => {
      let temp = snapshot.val();
      temp -= product.price;
      firebase.database().ref(`/Clients/${UID}/balance`).set(temp);
    });
  }
  getProducts() {
    let merchant = this.merchant;
    console.log("The merchant is");
    console.log(merchant);

    if (merchant != null) {
    firebase.database().ref('/Products/merchant').orderByChild('name').equalTo(merchant.name).once('value', async snapshot => {
        this.productsOfMerchant = snapshot.val();
        this.displayProducts = [];
        for (const ob of Object.keys(snapshot.val())) {
          this.displayProducts.push(this.productsInBudget[ob]);
        }
      }
    );
  }
  }
}
