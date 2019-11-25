import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'personalInfo'
})
export class PersonalInfoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
