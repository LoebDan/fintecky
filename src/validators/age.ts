import { FormControl } from '@angular/forms';

export class AgeValidator {
  static isValid(control: FormControl) {

    if(isNaN(control.value)){
      return {
        "not a number": true
      };
    }

    if(control.value % 1 !== 0){
      return {
        "not a whole number": true
      };
    }

    if(control.value < 13){
      return {
        "too young": true
      };
    }

    if (control.value > 120){
      return {
        "not realistic": true
      };
    }

    return null;
  }
}
