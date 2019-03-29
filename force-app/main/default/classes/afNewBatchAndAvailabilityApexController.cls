public class afNewBatchAndAvailabilityApexController {

    //Query for all Training Locations
    @AuraEnabled
    public static List<Training_Location__c> masterLocations () {
        
        return [SELECT Id, Name, OfficeName__c 
                FROM Training_Location__c];
    }
    
    //Query for all Rooms
    @AuraEnabled
    public static List<Training_Room__c> masterRooms (){

        return [SELECT Id, name, TrainingLocation__c, TrainingLocationName__c, AVAvailability__c, RoomCapacity__c
                FROM Training_Room__c
                ORDER BY name];

    }
    
    //Query for all Skills
    @AuraEnabled
    public static List<Skill__c> masterSkills(){

        return [SELECT Training_Track__c, Trainer__c 
                FROM Skill__c];
    }
    
    //Query for all Trainers
    @AuraEnabled
    public static List<User> masterTrainers(){

        return [SELECT Id, Name, Available__c
                FROM User 
                WHERE UserRole.Name = 'Trainer'];
    }
    
    //Query for all Trainings
    @AuraEnabled
    public static List<Training__c> masterOpenTrainings(){

        return [SELECT Id, Name, CreatedDate, CoTrainer__c, CoTrainer__r.name, 
                       Trainer__c, Trainer__r.Name, TrainingTarget__c,
                       TrainingLocation__c, TrainingLocation__r.OfficeName__c, 
                       TrainingTrack__c, TrainingTrack__r.ShortName__c, TrainingTrack__r.Color__c, 
                       TrainingClass__c, TrainingRoom__c, StartDate__c, EndDate__c
                FROM Training__c
                WHERE Status__c != 'Completed' OR Status__c != 'Cancelled'];
    }

}