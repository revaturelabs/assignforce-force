public class afPTOTabsApexController {

    @AuraEnabled
    public static List<PTO__c> getAllPTOs(ID user){
        return [SELECT Id, Status__c, StartDate__c FROM PTO__c WHERE Trainer__c=:user ORDER BY StartDate__c];
    }
    @AuraEnabled
    public static List<Training__c> getBatches(ID user){
        return [SELECT StartDate__c, EndDate__c FROM Training__c WHERE Trainer__c=:user OR CoTrainer__c=:user];
    }
}