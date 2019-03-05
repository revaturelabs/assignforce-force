public class afTrainersTabListViewApexController {

   @AuraEnabled
   public static List<User> allTrainers() {
       return [SELECT Id, Name, Available__c, Training_Skills__c, CurrentLocation__c
               FROM User
               WHERE UserRole.Name = 'Trainer' OR UserRole.Name = 'Co-Trainer'];
   }

}