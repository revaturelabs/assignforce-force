@isTest
public class afTrainingBatchesApexControllerTest {
    
     @isTest
    public static void afTrainingBatchesApexControllerTest(){
        List <Training__c> AllTrainings = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,
                                           Status__c, TrainingClass__c, StartDate__c, EndDate__c, Trainer__r.Name, CoTrainer__r.Name
                                           FROM Training__c
                                           ORDER BY StartDate__c];
        
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.AllTrainings);
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.currentTrainings);
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.getTrainingBatches());
        List<Training__c> testTrainings = [SELECT Id FROM Training__c LIMIT 2];
        String[] batchIds = new string[]{};
        for(integer i = 0; i < testTrainings.size(); i++){
            batchIds.add(testTrainings[i].id);
        }
        
        afTrainingBatchesApexController.deleteBatchesServer(batchIds);
        afTrainingBatchesApexController.AllTrainings = null;
        List<Training__c> newTrainingsList = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,
                                           Status__c, TrainingClass__c, StartDate__c, EndDate__c, Trainer__r.Name, CoTrainer__r.Name
                                           FROM Training__c];
        system.assertEquals(newTrainingsList.size(), afTrainingBatchesApexController.AllTrainings.size()); 
        afTrainingBatchesApexController.updateBatchesServer(newTrainingsList);
    }


}