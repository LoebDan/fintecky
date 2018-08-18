import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DriverviewridesinprogressPage } from "../driverviewridesinprogress/driverviewridesinprogress";

//Rating
// import { Ionic2RatingModule } from "ionic2-rating";



/**
 * Generated class for the RateuserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rateuser',
  templateUrl: 'rateuser.html',
})
export class RateuserPage {

  //rating
  rate : any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  // Rating
  onModelChange(event){
    this.rate = event;
    console.log(event);}


  ionViewDidLoad() {
    console.log('ionViewDidLoad RateuserPage');
  }

  //Submit Rating Button
  submitRating(){
    this.navCtrl.push(DriverviewridesinprogressPage)
  }
  //Ignore Rating Button
  ignoreRating(){
    this.navCtrl.push(DriverviewridesinprogressPage)
  }
}
