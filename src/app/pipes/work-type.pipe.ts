import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'workType'
})
export class WorkTypePipe implements PipeTransform {

  transform(value: string): any {
    if(!["fast","full","part","intern"].includes(value)) return;

    switch(value){
      case "fast":
        return "#CC7F7C";
      case "full":
        return "#5D82E2";
      case "part":
        return "#B1C78E";
      case "intern":
        return "#A982DE";
    }
  }

}
