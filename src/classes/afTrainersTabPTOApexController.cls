public class afTrainersTabPTOApexController {

   @auraEnabled
   public static List<PTO__c> getTrainingPTOById(Id userId){
       system.debug(userId);
       List<PTO__c> trainerPTO = [SELECT StartDate__c , EndDate__c, Reason__c, Status__c
                                  FROM PTO__c
                                  WHERE Trainer__c = :userId AND EndDate__c > TODAY
                                  ORDER BY StartDate__c];
       system.debug(trainerPTO);
       return trainerPTO;
   }
}