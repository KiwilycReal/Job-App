import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'resumePreview'
})
export class ResumePipe implements PipeTransform {

  transform(value: any, type: string): any {
    if(typeof value === "string") return value;

    switch(type){
      case "workExps":
      case "eduExps":
        return value.entityName+", "+value.geolocation;
      case "projExps":
        return value.name;
      case "honors":
        return value.title;
    }
  }

}
