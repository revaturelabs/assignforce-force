public class afTrainersTabListViewApexController {

   @AuraEnabled
   public static List<User> allTrainers() {
       return [SELECT Id, Name, Available__c, Training_Skills__c, CurrentLocation__c
               FROM User
               WHERE UserRole.Name = 'Trainer' OR UserRole.Name = 'Co-Trainer'];
   }

   @AuraEnabled
   public static String getTrainerSkills(Id trainerId) {
       String returnSkills;

       List<Skill__c> trainerSkills = [SELECT Training_Track__r.ShortName__c
                                       FROM Skill__c
                                       WHERE Trainer__c = :trainerId];

       if(trainerSkills.size() > 0) {
           for(Integer i = 0; i < trainerSkills.size(); i++) {
               if(returnSkills == null) {
                   returnSkills = trainerSkills[i].Training_Track__r.ShortName__c;
               } else {
                   returnSkills += (', ' + trainerSkills[i].Training_Track__r.ShortName__c);
               }
           }
       }
       return returnSkills;
   }
}