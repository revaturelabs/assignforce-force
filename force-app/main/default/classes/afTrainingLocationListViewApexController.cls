public class afTrainingLocationListViewApexController {
    
    public static List<Training__c> AllTrainings
    {
        get{
            if(AllTrainings == null)
            {
                AllTrainings = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, Status__c, StartDate__c, EndDate__c, Trainer__r.name, CoTrainer__r.name, TrainingTrack__r.name, TrainingClass__c 
                                FROM Training__c 
                                ORDER BY StartDate__c];
            }
            
            return AllTrainings;
        }
        set;
    }
    
    @AuraEnabled
    public static List<Training__c> currentTrainings
    {
        get{
            if(currentTrainings == null)
            {
                currentTrainings = AllTrainings;
            }
            return currentTrainings;
        }
        set;
    }
    
    
    /*
    @AuraEnabled
    public static String[] getTrainings()
    {
        System.debug('this is getting called');

        System.debug(trainingLocations);
        return trainingLocations;
        
    }*/

}