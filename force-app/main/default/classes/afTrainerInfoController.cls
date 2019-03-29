public class afTrainerInfoController {

    //This method queries the database to get the information about the trainer
    //that is passed in the userId parameter
    @AuraEnabled
    public static ContentDocument getFile(Id userId){
        return [SELECT Id, Title FROM ContentDocument WHERE CreatedbyId = :userId ORDER BY CreatedDate DESC LIMIT 1];
    }
}