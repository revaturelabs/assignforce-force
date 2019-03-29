/**********************************************
* afTrainersTabPTOApexController Test Class
* Author: Ian Blanchard
*
* The method in this controller returns all the PTO for a given trainer
*   by their id. This test will create a user and 200 PTOS for that user,
*   and use the method in the controller to ensure that the data is returned
*   correctly.
**********************************************/

@isTest
public with sharing class afTrainersTabPTOApexControllerTest {

    private static User u;
    private static List<PTO__c> ptos;

    @TestSetup
    static void doSetup(){

        Test.startTest();

        //Create the Trainer user that will be used in the test.
        u = UtilityMethods.createUserData(1).get(0);
        insert u;

        ptos = UtilityMethods.createPTOData(50,u);
        System.runAs(u){
            insert ptos;
        }

        Test.stopTest();

    }

    @isTest
    public static void getTrainingPTOByIdTest() {

        Test.startTest();

        //Get the user created in Setup
        u = [SELECT id FROM User WHERE name = 'last 0' LIMIT 1];

        //Use the Controller method to get the PTO requests
        List<PTO__c> results = afTrainersTabPTOApexController.getTrainingPTOById(u.id);

        //Query directly for the PTO requests
        List<PTO__c> queryResults = [SELECT id,StartDate__c,EndDate__c FROM PTO__c];

        //Make sure the results from the controller method are not null
        //and the number of results was 50
        System.assertNotEquals(results, null);
        System.assertEquals(results.size(),50);

        //check that the results from the controller match the results from the query
        System.assertEquals(results.size(), queryResults.size());

        for (Integer i = 0; i < results.size(); i++) {
            //Assert that every PTO has the correct fields
            System.assertEquals(results.get(i).StartDate__c, queryResults.get(i).StartDate__c);
            System.assertEquals(results.get(i).EndDate__c,   queryResults.get(i).EndDate__c);
            System.assertEquals(results.get(i).Status__c,    'Pending Approval');
        }

        Test.stopTest();

    }

    @isTest 
    public static void approvePTOTest(){
        
        //get the PTO requests
        ptos = [SELECT id, Status__c FROM PTO__c WHERE Trainer__r.UserRole.Name = 'Trainer'];

        Test.startTest();

        //Use the method to approve all PTOs
        for (PTO__c p : ptos){
            afTrainersTabPTOApexController.approvePTO(p.id);
        }

        Test.stopTest();

        //Requery for the now approved PTOs
        ptos = [SELECT id, Status__c FROM PTO__c WHERE Trainer__r.UserRole.Name = 'Trainer'];

        //Check that they have all been approved
        for (PTO__c p : ptos){
            System.assertEquals(p.Status__c, 'Approved');
        }

    }

    @isTest 
    public static void rejectPTOTest(){
        
        //Query for the PTO requests
        ptos = [SELECT id, Status__c FROM PTO__c WHERE Trainer__r.UserRole.Name = 'Trainer'];

        Test.startTest();

        for (PTO__c p : ptos){
            afTrainersTabPTOApexController.rejectPTO(p.id);
        }

        Test.stopTest();

        //Requery for the updated PTO requests
        ptos = [SELECT id, Status__c FROM PTO__c WHERE Trainer__r.UserRole.Name = 'Trainer'];

        //Check that they are all now rejected
        for (PTO__c p : ptos){
            System.assertEquals(p.Status__c, 'Rejected');
        }


    }

}