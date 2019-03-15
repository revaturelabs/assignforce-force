/*
 * afTrainersTabPTOApexController Test
 * The method in this controller returns all the PTO for a given trainer
 * by their id. This test will create a user and 200 PTOS for that user,
 * and use the method in the controller to ensure that the data is returned
 * correctly.
 */


@isTest
public with sharing class afTrainersTabPTOApexControllerTest {

    @TestSetup
    static void doSetup(){

        //Create the Trainer user that will be used in the test.
        User u = new User(
            ProfileId = [SELECT Id FROM Profile WHERE Name = 'Trainer' LIMIT 1].id,
            LastName = 'last ' + Math.round(Math.random()),
            Email = 'puser' + Math.round(Math.random()) + '@amamama.com',
            Username = 'puser' + Math.round(Math.random()) + '@amamama.com' + System.currentTimeMillis(),
            CompanyName = 'TEST',
            Title = 'title',
            Alias = 'alias',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            Available__c = 'Available',
            UserRoleId = [SELECT Id FROM UserRole WHERE Name = 'Trainer' LIMIT 1].id);
        
        //Insert the user record
        insert u;

    }

    @isTest
    public static void doTest() {

        Test.startTest();

        //Get the user created in Setup
        User u = [SELECT id FROM User WHERE UserRole.name = 'Trainer' LIMIT 1];

        //Create a list to store the PTOs about to be created
        List<PTO__c> ptos = new List<PTO__c>();

        //Create 200 PTO requests with all fields filled since the method in the controller
        //  queries for all of these
        for (integer i = 0; i < 200; i++){
            PTO__c p = new PTO__c(Trainer__c = u.id,
                                  StartDate__c = Date.today(),
                                  EndDate__c = Date.today().addDays(10),
                                  Reason__c = 'Test',
                                  Status__c = 'Needs to be Submitted');
            ptos.add(p);
        }

        //Insert the list of PTOs
        insert ptos;

        //Use the Controller method to get the PTO requests
        List<PTO__c> results = afTrainersTabPTOApexController.getTrainingPTOById(u.id);

        //Query directly for the PTO requests
        List<PTO__c> queryResults = [SELECT id FROM PTO__c];

        //Make sure the results from the controller method are not null
        //and the number of results was 200
        System.assertNotEquals(results, null);
        System.assertEquals(results.size(),200);

        //check that the results from the controller match the results from the query
        System.assertEquals(results.size(), queryResults.size());

        for (PTO__c p : results) {
            //Assert that every PTO has the correct fields
            System.assertEquals(p.StartDate__c, Date.today());
            System.assertEquals(p.EndDate__c,   Date.today().addDays(10));
            System.assertEquals(p.Status__c,    'Needs to be Submitted');
            System.assertEquals(p.Reason__c,    'Test');
        }

        Test.stopTest();

    }

}