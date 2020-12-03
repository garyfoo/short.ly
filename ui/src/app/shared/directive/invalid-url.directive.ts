import { ValidatorFn, AbstractControl } from '@angular/forms';

export function invalidUrlValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    // const regExp: RegExp = new RegExp(
    //   '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?'
    // );
    // const invalid: boolean = !regExp.test(control.value);
    let url: URL;
    try {
      url = new URL(control.value);
    } catch (ex) {
      // console.error('Invalid URL', ex.message);
    }
    return url ? null : { invalidUrl: true };
  };
}
