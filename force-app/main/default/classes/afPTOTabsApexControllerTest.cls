/****************************************************
* afPTOTabsApexController Test Class
* Author: sergey sambros
*
* Test the Apex Controller for the afPTOTabs
*   component
* 4/4 lines covered
*****************************************************/

@isTest
public class afPTOTabsApexControllerTest {
    
    @testSetup 
    public static void testDataSetup() {
        
        //Ptos
        List<PTO__c> ptoToCreate = new List<PTO__c>();

        //Setup test data: Locations, Training Tracks, Trainings, User
        List<Training_Location__c> testL = UtilityMethods.createLocationData(6);
        
        List<User> testU = UtilityMethods.createUserData(3);       
        List<Training_Track__c> testT = UtilityMethods.createTrainingTrackData(3);
        List<Training__c> testTr = UtilityMethods.createTrainingsData(9, testL, testU, 
                                                                    UtilityMethods.createStartDateData(9), testT);
        //create test PTOs
        for(Integer i=0; i<7; i++) {
            PTO__c newpto = new PTO__c(Status__c='Pending Approval',Trainer__c=testU[0].Id);
            ptoToCreate.add(newpto);
        }

        //below prevents mixed dml error by preventing 
        insert testU;
        System.runAs(testU[0]){
            insert testT;
            insert testL;
            insert testTr;            
        }

    }


	//this is comparing the soql in the method to the expected results
    @isTest
    public static void doTest() {

        Test.startTest();

        //get test user
        User testUser = [SELECT id FROM USER LIMIT 1];
        Id testId = testUser.id;

		//this is comparing the soql in the method to the expected result         
        List<Training__c> testBatches = afPTOTabsApexController.getBatches(testUser.id);
        List<Training__c> actualBatches = [SELECT StartDate__c, EndDate__c 
                                           FROM Training__c 
                                           WHERE Trainer__c=:testId OR CoTrainer__c=:testId];
        System.assertEquals(testBatches,actualBatches);

        List<PTO__c> testPTO = [SELECT Id, Status__c, StartDate__c FROM PTO__c ORDER BY StartDate__c];
        List<PTO__c> actualPTO = afPTOTabsApexController.getAllPTOs(testId);

        System.assertEquals(testPTO,actualPTO);

        Test.stopTest();
    }
}