import { Component } from '@angular/core';
import {
  Alert,
  AlertController,
  IonicPage,
  NavController
} from 'ionic-angular';
import { ProfileProvider } from '../../providers/profile/profile';
import { AuthProvider } from '../../providers/auth/auth';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  public userProfile: any;
  public birthDate: string;
  public ContactNo: string;
  public ID: string;
  profile = {
    name: '',
    surname: '',
    ContactNo: '',
    email: '',
    ID: '',
    //new additions
    CarMake: '',
    CarModel: '',
    DriverID: '',
    LicensePlate: '',
  };

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public authProvider: AuthProvider,
    public profileProvider: ProfileProvider
  ) {}

   ionViewDidEnter() {
    this.profileProvider.getUserProfile().on('value', userProfileSnapshot => {
      this.userProfile = userProfileSnapshot.val();
      this.birthDate = userProfileSnapshot.val().birthDate;
      this.profile.ContactNo = userProfileSnapshot.val().ContactNo;
      this.ContactNo = userProfileSnapshot.val().ContactNo;
      this.profile.ID = userProfileSnapshot.val().ID;
      console.log(this.profile.ID + " ID");
    });
  }

  logOut(): void {
    this.authProvider.logoutUser().then(() => {
      this.navCtrl.setRoot('LoginPage');
    });
  }

  updateName(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'Your first name & last name',
      inputs: [
        {
          name: 'firstName',
          placeholder: 'Your first name',
          value: this.userProfile.firstName
        },
        {
          name: 'lastName',
          placeholder: 'Your last name',
          value: this.userProfile.lastName
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateName(data.firstName, data.lastName);
          }
        }
      ]
    });
    alert.present();
  }

  updateDOB(birthDate: string): void {
    this.profileProvider.updateDOB(birthDate);
  }
  updateContactNo(ContactNo: string): void{
    this.profileProvider.updateContactNo(this.ContactNo);
  }

  updateEmail(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newEmail', placeholder: 'Your new email' },
        { name: 'password', placeholder: 'Your password', type: 'password' }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider
              .updateEmail(data.newEmail, data.password)
              .then(() => {
                console.log('Email Changed Successfully');
              })
              .catch(error => {
                console.log('ERROR: ' + error.message);
              });
          }
        }
      ]
    });
    alert.present();
  }

  updatePassword(): void {
    let alert: Alert = this.alertCtrl.create({
      inputs: [
        { name: 'newPassword', placeholder: 'New password', type: 'password' },
        { name: 'oldPassword', placeholder: 'Old password', type: 'password' }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updatePassword(
              data.newPassword,
              data.oldPassword
            );
          }
        }
      ]
    });
    alert.present();
  }

  // new additions

  updateCar(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'Your car make and model',
      inputs: [
        {
          name: 'CarMake',
          placeholder: 'Car Make (eg. Ford)',
          value: this.userProfile.CarMake
        },
        {
          name: 'CarModel',
          placeholder: 'Car Model (eg. Fiesta)',
          value: this.userProfile.CarModel
        }
      ],
      buttons: [
        { text: 'Cancel' },
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateCar(data.CarMake, data.CarModel);
          }
        }
      ]
    });
    alert.present();
  }



  updateLicensePlate(): void {
    const alert: Alert = this.alertCtrl.create({
      message: 'License Plate Number',
      inputs: [
        {
          name: 'LicensePlate',
          placeholder: 'License Plate',
          value: this.userProfile.LicensePlate
        }
      ],
      buttons: [
        {text: 'Cancel'},
        {
          text: 'Save',
          handler: data => {
            this.profileProvider.updateLicensePlate(data.LicensePlate);
          }
        }

      ]
    });
    alert.present();
  }
}
