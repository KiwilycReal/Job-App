export interface BaseExperience {
    startDate: string;
    endDate: string;
    entityName: string;
    description: string;
    geolocation: string;
}

export interface EducationExperience extends BaseExperience{
    major: string;
    grade?: string;
    level: string;
}

export interface WorkExperience extends BaseExperience{
    position: string;
}

export interface ProjectExperience extends BaseExperience{
    name: string;
    position: string;
}
