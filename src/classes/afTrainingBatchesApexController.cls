public class afTrainingBatchesApexController{

   public static List<Training__c> AllTrainings
   {
       get{
           if(AllTrainings == null)
           {
               AllTrainings = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,
                               Status__c, TrainingClass__c, StartDate__c, EndDate__c, Trainer__r.Name, CoTrainer__r.Name
                               FROM Training__c
                               ORDER BY StartDate__c];
           }

           return AllTrainings;
       }
       set;
   }

   @AuraEnabled
   public static List<Training__c> currentTrainings
   {
       get{
           if(currentTrainings == null)
           {
               currentTrainings = AllTrainings;
           }
           return currentTrainings;
       }
       set;
   }

   @AuraEnabled
   public static List<Training__c> getTrainingBatches() {
       return AllTrainings;
   }
    
    @AuraEnabled
    public static void deleteBatchesServer(String[] batchIds)
    {
       // Map<String, String> Objects = new Map<String, String>();
      
        List<Training__c> batchesToDelete = new List<Training__c>();
        
        for(integer s = 0; s < batchIds.size(); s++){
                batchesToDelete.add(new Training__c(Id = batchIds[s]));
            }
        
        /*
        List<SObject> batches = new List<SObject>();
        for(integer i = 0; i < AllTrainings.size(); i++){
            for(integer j = 0; j < batchIds.size()-1; j++){
                if(AllTrainings[i].id == batchIds[j] )
                {
                    batches.add(AllTrainings[i]);
                }
            }
        }*/
        delete batchesToDelete; 
    }
    
    @AuraEnabled
    public static void updateBatchesServer(List<Training__c> updatedBatches){
		System.debug('Batches to Update: ' + updatedBatches);
        /*
        List<Training__c> batchesToUpdate = new List<Training__c>();
        
        for(integer s = 0; s < updatedBatches.size(); s++){
                batchesToUpdate.add(new Training__c(updatedBatches[s]));
        }*/
        update updatedBatches;
        System.debug('Update ran on batches');
    }

}