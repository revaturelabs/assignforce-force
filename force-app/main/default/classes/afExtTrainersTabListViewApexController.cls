/**
*Controller for external trainers list view. VERY similar to afTrainersTabListView but implemented for external trainers. Should be encapsulated tbh.
*By-Sharif and Jon
*
*/
public class afExtTrainersTabListViewApexController {

   @AuraEnabled
   public static List<External_Trainer__c> allTrainers() {
       return [SELECT Id, First_Name__c, Last_Name__c, Available__c, Training_Skills__c, Current_Location__c
               FROM External_Trainer__c
            ];
   }

   @AuraEnabled
   public static String getTrainerSkills(Id ExternalTrainerId) {

        String returnSkills;

        String ExternaltrainerSkills = [SELECT Id, Training_Skills__c
                                        FROM External_Trainer__c
                                        WHERE Id = :ExternalTrainerId
                                        LIMIT 1].Training_Skills__c;

        returnSkills = ExternaltrainerSkills.replace(';',', ');

        return returnSkills;
   }
}