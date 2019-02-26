public class afProfileInfoController {

    @AuraEnabled
    public static ContentVersion getFiles(Id userId){
        return [SELECT Id, Title FROM ContentVersion WHERE CreatedbyId = :userId LIMIT 1];
    }
}