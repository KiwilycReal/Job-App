import { SafeResourceUrl } from '@angular/platform-browser';

export interface JobInfo {

    ID: string;

    ImageUrl: SafeResourceUrl;

    Title: string;

    Salary: number;

    IntroText: string;

    Details: any;
}

