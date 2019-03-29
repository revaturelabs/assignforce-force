@isTest
public class afExtTabListViewApexControllerTest {

    private static List<External_Trainer__c> xtrainers;

    @TestSetup
    public static void doSetup(){

        xtrainers = UtilityMethods.createExternalTrainerData(50);
        insert xtrainers;
        
    }
    
    @isTest
    public static void allTrainersTest(){

        xtrainers = [SELECT Id, First_Name__c, Last_Name__c, Available__c, Training_Skills__c, Current_Location__c
                     FROM External_Trainer__c];

        Test.startTest();

        List<External_Trainer__c> results = afExtTrainersTabListViewApexController.allTrainers();

        Test.stopTest();

        System.assertNotEquals(results,null);
        System.assertEquals(results.size(),xtrainers.size());
        for (External_Trainer__c x : results){
            System.assert(xtrainers.contains(x));
        }
    }

    @isTest
    public static void getTrainerSkillsTest(){

        xtrainers = [SELECT id FROM External_Trainer__c];

        Test.startTest();

        for (External_Trainer__c x : xtrainers) {
            String result = afExtTrainersTabListViewApexController.getTrainerSkills(x.id);
            System.assertEquals(result, 'Other, Pega, Salesforce');
        }

        Test.stopTest();
    }
}