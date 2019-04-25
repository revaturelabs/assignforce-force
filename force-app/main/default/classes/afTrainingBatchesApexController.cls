public class afTrainingBatchesApexController{

   public static List<Training__c> AllTrainings
   {
       get{
           if(AllTrainings == null)
           {
               AllTrainings = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,
                               Status__c, TrainingClass__c, StartDate__c, EndDate__c, TrainingLocation__r.ShippingCity__c, Trainer__r.Name, CoTrainer__r.Name
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
    
    //Used by afEmployeeBatchesCmp to get batches by trainers id to populate data tables
    @AuraEnabled
    public static List<Training__c> getTrainingBatchesById(Id userId){
       // System.runAs()
        List<Training__c> userTrainings = 
            //database.query('SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,Status__c, TrainingClass__c, StartDate__c, EndDate__c, TrainingLocation__r.ShippingCity__c, Trainer__r.Name, CoTrainer__r.Name FROM Training__c WHERE Trainer__r.Id = :userId   ORDER BY StartDate__c');
            [SELECT Id, Name, TrainingClass__c, StartDate__c, EndDate__c, Status__c, TrainingTrack__r.ShortName__c, TrainingLocation__r.OfficeName__c 
             FROM Training__c 
             WHERE (Trainer__r.Id = :userId OR CoTrainer__r.Id = :userId)
             ORDER BY StartDate__c];
            return userTrainings;
    }
    
    @AuraEnabled
    public static void deleteBatchesServer(String[] batchIds)
    {

        List<Training__c> batches = new List<Training__c>();
        
        for(integer s = 0; s < batchIds.size(); s++){
            batches.add(new Training__c(Id = batchIds[s]));
        }      

        for(Training__c t : batches) {
            for (Integer i = 0; i < AllTrainings.size(); i++){
                if (t.id == AllTrainings.get(i).id){
                    AllTrainings.remove(i);
                    break;
                }
            }
        }
        
       
        delete batches; 
    }
    
    @AuraEnabled
    public static void updateBatchesServer(List<Training__c> updatedBatches){
		System.debug('Batches to Update: ' + updatedBatches);
        
        for(integer s = 0; s < updatedBatches.size(); s++){
            if(updatedBatches[s].StartDate__c != null)
            {
                updatedBatches[s].StartDate__c = updatedBatches[s].StartDate__c.addDays(-1);
                System.debug('after subtract day: ' + updatedBatches[s]);
            }
            else if(updatedBatches[s].EndDate__c != null)
            {
                updatedBatches[s].EndDate__c = updatedBatches[s].EndDate__c.addDays(-1);
                System.debug('after subtract day: ' + updatedBatches[s]);
            }
        }
        
        update updatedBatches;
        
    }
	
}