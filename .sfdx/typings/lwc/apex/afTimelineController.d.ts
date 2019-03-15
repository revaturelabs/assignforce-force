declare module "@salesforce/apex/afTimelineController.getTrainingLocations" {
  export default function getTrainingLocations(): Promise<any>;
}
declare module "@salesforce/apex/afTimelineController.getTrainers" {
  export default function getTrainers(): Promise<any>;
}
declare module "@salesforce/apex/afTimelineController.wrapTrainingToJSON" {
  export default function wrapTrainingToJSON(): Promise<any>;
}
declare module "@salesforce/apex/afTimelineController.filterTrainingsByYearLocationQuarter" {
  export default function filterTrainingsByYearLocationQuarter(param: {location: any, year: any, quarter: any}): Promise<any>;
}
declare module "@salesforce/apex/afTimelineController.filterTrainingsByYearLocation" {
  export default function filterTrainingsByYearLocation(param: {location: any, year: any}): Promise<any>;
}
declare module "@salesforce/apex/afTimelineController.filterTrainingsByYearQuarter" {
  export default function filterTrainingsByYearQuarter(param: {year: any, quarter: any}): Promise<any>;
}
declare module "@salesforce/apex/afTimelineController.filterTrainingsByYear" {
  export default function filterTrainingsByYear(param: {year: any}): Promise<any>;
}
