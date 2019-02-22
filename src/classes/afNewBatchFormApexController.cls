public class afNewBatchFormApexController {
    
    @AuraEnabled
    public static List<Training_Room__c> allRooms (Training_Location__c loc) {
        List<Training_Room__c> rooms = [SELECT Id, Name, TrainingLocation__c
                                        FROM Training_Room__c];
        return rooms;
    }
    
    @AuraEnabled
    public static List<Training__c> allTrainings () {
        List<Training__c> trngList = [SELECT Id, Name, TrainingTrack__c, StartDate__c, EndDate__c, CreatedDate, TrainingRoom__c, Trainer__c, CoTrainer__c 
                                      FROM Training__c];
        return trngList;
    }
}