public class afTrainerInfoController {
    
    @AuraEnabled
    public static ContentDocument getFile(Id userId){
        return [SELECT Id, Title FROM ContentDocument WHERE CreatedbyId = :userId ORDER BY CreatedDate DESC LIMIT 1];
    }
}