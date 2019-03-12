public class afNewBatchFormApexController {
    
    // IT WORKED!
    
    @AuraEnabled
    public static List<Training_Room__c> allRooms (Training_Location__c loc) {
        List<Training_Room__c> rooms = [SELECT Id, Name, TrainingLocation__c
                                        FROM Training_Room__c];
        return rooms;
    }
    
    @AuraEnabled
    public static List<Training_Location__c> allLocs () {
        List<Training_Location__c> locs = [SELECT Id, Name, OfficeName__c
                                           FROM Training_Location__c];
        return locs;
    }
    
    @AuraEnabled
    public static List<Training__c> allTrainings () {
        List<Training__c> trngList = [SELECT Id, Name, TrainingTrack__c, StartDate__c, EndDate__c, CreatedDate, TrainingRoom__c, Trainer__c, CoTrainer__c 
                                      FROM Training__c
                                      WHERE EndDate__c >= TODAY];
        return trngList;
    }
}