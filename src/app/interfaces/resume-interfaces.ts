export interface BaseExperience {
    startDate: string;
    endDate: string;
    entityName: string;
    description: string;
}

export interface EducationExperience extends BaseExperience{
    major: string;
    grade?: string;
    level: string;
    geolocation: string;
}

export interface WorkExperience extends BaseExperience{
    position: string;
    geolocation: string;
}

export interface ProjectExperience extends BaseExperience{
    name: string;
    position: string;
}

export interface Honor extends BaseExperience{
    title: string;
}
