public class afPTOTabsApexController {

    @AuraEnabled
    public static List<PTO__c> getAllPTOs(ID user){
        return [SELECT Id, Status__c, StartDate__c FROM PTO__c WHERE Trainer__c=:user ORDER BY StartDate__c];
    }
}