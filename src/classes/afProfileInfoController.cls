public class afProfileInfoController {
    
    @AuraEnabled
    public static ContentDocument getFile(Id userId){
        return [SELECT Id, Title FROM ContentDocument WHERE CreatedbyId = :userId ORDER BY CreatedDate DESC LIMIT 1];
    }
    
    @AuraEnabled
    public static List<PTO__c> getPTO(Id userId){
        return [SELECT StartDate__c, EndDate__c, Status__c, Trainer__c FROM PTO__c WHERE Trainer__c = :userId];
    }
}