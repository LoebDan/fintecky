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


