import { SafeResourceUrl } from '@angular/platform-browser';

export interface JobInfo {

    imageUrl: SafeResourceUrl;

    title: string;

    salary: number;

    introText: string;

    details: any;

    position: string;

    tags: string[];
    
    publishDateTime: string;

    lastEditDateTime: string;

}

