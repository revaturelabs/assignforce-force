public class afTrainersTabPTOApexController {

   @auraEnabled
   public static List<PTO__c> getTrainingPTOById(Id userId){
       system.debug(userId);
       List<PTO__c> trainerPTO = [SELECT StartDate__c , EndDate__c, Reason__c, Status__c
                                  FROM PTO__c
                                  WHERE Trainer__c = :userId AND endDate__c >= TODAY
                                  ORDER BY StartDate__c];
       system.debug(trainerPTO);
       return trainerPTO;
   }
    
   @AuraEnabled
   public static void approvePTO(List<Id> ptoIdToApprove){
       System.debug('approvePTO: ' + ptoIdToApprove);
       
       List<PTO__c> pto = new List<PTO__c>();
       
       // Gets PTO__c record based on ptoIdToApprove
       pto = [SELECT Status__c 
              FROM PTO__c
              WHERE Id IN :ptoIdToApprove];
       
       System.debug('pto before update, from approvePTO: ' + pto);
       
       // Change Status__c to Approved
       for(PTO__c p : pto) {
       p.Status__c = 'Approved';
       }
       
       System.debug('pto after update, from approvePTO: ' + pto);
       
       // upsert the record
       try{
           upsert pto;
       } catch (DMLException dmle) {
           System.debug('Error: ' + dmle.getMessage());
       }
   }

   @AuraEnabled
   public static void rejectPTO(List<Id> ptoIdToReject){
       System.debug('rejectPTO: ' + ptoIdToReject);
       
       List<PTO__c> pto = new List<PTO__c>();
       
       // Gets PTO__c record based on ptoIdToReject
       pto = [SELECT status__c 
              FROM PTO__c
              WHERE Id = :ptoIdToReject];
       
       System.debug('pto before update, from rejectPTO: ' + pto);
       
       // Change Status__c to Rejected
       for(PTO__c p : pto){
       p.Status__c = 'Rejected';
       }
       
       System.debug('pto after update, from rejectPTO: ' + pto);
       
       // upsert the record
       try{
           upsert pto;
       } catch (DMLException dmle) {
           System.debug('Error: ' + dmle.getMessage());
       }
    }
    
}