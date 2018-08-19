import {Injectable} from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

import {User} from '@firebase/auth-types';

@Injectable()
export class ChartDataProvider {
  public clientProfile: firebase.database.Reference;
  public lineChartMonthData;
  public lineChartMonthLabels: Array<any>;
  public lineChartWeekData;
  public lineChartWeekLabels;

  public clientTransactions = [];
  public userTransactions: Array<any>;
  public transactionValues: Array<any>;
  public userBalance;



  public allTransactions: Array<any>; //pulls all txs

  constructor() {
  let myUID = 'anything';
    console.log(myUID);
       //this.myUID = user;
    let Transactions = [];
        firebase.database().ref(`/Clients/${myUID}`).once('value', snap => {
          let Client = snap.val();


          for (const ob of Object.keys(Client.transactions)) {
            Transactions.push(ob);
          }
          console.log(Transactions);


          let today = Date.now();
          let todayReadable = new Date(today);
          let yearToday = new Date(today).getFullYear();
          let monthToday = new Date(today).getMonth();
          let dayOfMonth = new Date(today).getDate();
          let pastSevenDays = dayOfMonth-7;
          let dayOfWeek = new Date(today).getDay();

          let dayOfWeekSA = dayOfWeek+8;
          let lineChartWeekNumbers = Array.apply(null, Array(7)).map(Number.prototype.valueOf,0);
          this.lineChartWeekLabels = Array.apply(null, Array(7)).map(String.prototype.valueOf,"")
          for (var i = 6; i >= 0; i--) {
            lineChartWeekNumbers[i] = (i+dayOfWeekSA)%7;
          }

          for (var i =0; i < 7; i++) {
            if (lineChartWeekNumbers[i] == 0) {
              this.lineChartWeekLabels[i] = "Sunday";
            }
            if (lineChartWeekNumbers[i] == 1) {
              this.lineChartWeekLabels[i] = "Monday";
            }
            if (lineChartWeekNumbers[i] == 2) {
              this.lineChartWeekLabels[i] = "Tuesday";
            }
            if (lineChartWeekNumbers[i] == 3) {
              this.lineChartWeekLabels[i] = "Wednesday";
            }
            if (lineChartWeekNumbers[i] == 4) {
              this.lineChartWeekLabels[i] = "Thursday";
            }
            if (lineChartWeekNumbers[i] == 5) {
              this.lineChartWeekLabels[i] = "Friday";
            }
            if (lineChartWeekNumbers[i] == 6) {
              this.lineChartWeekLabels[i] = "Saturday";
            }
          }



          this.lineChartMonthData = Array.apply(null, Array(dayOfMonth)).map(Number.prototype.valueOf,0);
          this.lineChartWeekData = Array.apply(null, Array(7)).map(Number.prototype.valueOf,0);
          console.log(todayReadable);
          console.log(dayOfMonth);
          console.log(dayOfWeekSA);

          for (const ob of Transactions){
            //console.log(ob.id);
            firebase.database().ref(`/Transactions`).orderByChild('id').equalTo(ob.toString()).once('value', snap => {
              console.log(snap.val());
              let SingularTransaction = snap.val();
              for (const ob2 of Object.keys(SingularTransaction)) {
                console.log(SingularTransaction);
                console.log("DAY EPOCH" + SingularTransaction[ob2].time);
                let currday = SingularTransaction[ob2].time;
                let theday = new Date(SingularTransaction[ob2].time);
                console.log("THE DAY" + theday);
                console.log(SingularTransaction[ob2].value);
                console.log(theday.getFullYear() + "vs" + yearToday + "and" + theday.getMonth() + "vs" + monthToday);
                if (theday.getFullYear() == yearToday && theday.getMonth() == monthToday) {
                  this.lineChartMonthData[theday.getDate()-1] += SingularTransaction[ob2].value;
                  console.log(theday.getDate());
                  console.log("hello" + this.lineChartMonthData[theday.getDate()-1]);
                  console.log("hello" + this.lineChartMonthData[theday.getDate()-2]);
                  if (theday.getDate() >= dayOfMonth-6) {
                    this.lineChartWeekData[6-(dayOfMonth-theday.getDate())] += SingularTransaction[ob2].value;
                    console.log(this.lineChartMonthData);
                    console.log(this.lineChartWeekData);
                    console.log(this.lineChartWeekLabels);
                  }

                }
              }
            });

          }

        });
    console.log(this.lineChartMonthData);
    console.log(this.lineChartWeekData);



        /*this.allTransactions = firebase.database().ref.child(`Transactions`).orderByChild('clientID').equalTo(`${this.myUID}`).on("value", function(snapshot) {
          console.log(snapshot.val());
          snapshot.forEach(function(data) {
            console.log(data.key);
          })
        })*/


      }




  fetchWeekData() {
    return this.lineChartWeekData;
  }
  fetchWeekLabels() {
    return this.lineChartWeekLabels;
  }
  fetchMonthData() {
    return this .lineChartMonthData;
  }


}
