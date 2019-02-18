public class afNewBatchFormApexController {
    
    @AuraEnabled
    public static List<Training_Room__c> allRooms (Training_Location__c loc) {
        List<Training_Room__c> rooms = [SELECT Id, Name, TrainingLocation__c
                                             FROM Training_Room__c];
        System.debug(rooms);
        return rooms;
    }
    
    @AuraEnabled
    public static void submitNewBatch(Training__c newBatch){
        insert newBatch;
    }
    
}