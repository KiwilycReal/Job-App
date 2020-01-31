import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workType'
})
export class WorkTypePipe implements PipeTransform {

  transform(value: string): any {
    if(!["fast","full","part","intern"].includes(value)) return;

    switch(value){
      case "fast":
        return "#FF0066";
      case "full":
        return "#000099";
      case "part":
        return "#66CC66";
      case "intern":
        return "#6633CC";
    }
  }

}
