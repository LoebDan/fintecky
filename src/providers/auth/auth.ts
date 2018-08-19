import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Events } from 'ionic-angular';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  constructor(public events: Events) {}

  //Might need to change promise back to user
  loginUser(email: string, password: string): Promise<void> {
    return firebase.auth().signInWithEmailAndPassword(email, password).then(() =>{
      this.events.publish('user:login', true);
    });
  }

  async setSignUpDetails(email){
    console.log(email + " The email in the auth provider");
    const userId: string = await firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .set({
        email: email,
        HasFilledOutDetails: 'No'
      });
  }

  signupUser(email: string, password: string): Promise<void> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then( () => {
        this.setSignUpDetails(email).then(() =>{
          this.events.publish('user:signup', true);
          firebase.database().ref('/Clients').once('value', async snapshot => {
           let snappy = snapshot.val();
             let people = [];
             for ( const ob of Object.keys(snapshot.val())) {
              people.push(snappy[ob].key);
             }
             let bool = true
             const userId: string = firebase.auth().currentUser.uid;
            people.forEach(element => {
             
              if (element == userId) {
                bool = false
              }
            });
            if (bool) {
              let jsonData =  {
                "balance" : 1000,
                "name" : "NA",
                "transactions" : {
                 
                },
                "uid" : userId
              };
              firebase.database().ref(`/Clients/${userId}`).set(jsonData);

            }
             
           } );

        })
      })
      .catch(error => {
        console.error(error);
        throw new Error(error);
      });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    const userId: string = firebase.auth().currentUser.uid;
    firebase
      .database()
      .ref(`/userProfile/${userId}`)
      .off();
    this.events.publish('user:logout', true);
    return firebase.auth().signOut();
  }
}


