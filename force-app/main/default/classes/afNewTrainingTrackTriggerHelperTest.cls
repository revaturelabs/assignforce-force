@isTest
public with sharing class afNewTrainingTrackTriggerHelperTest {

    @isTest
    public static void doTest() {

        //Call the UtilityClass to create and insert training track
        ApexTestUtilityClass.createNewTrainingTrack();

        //Query to get the training track that was inserted back from the Org
        Training_Track__c newTrack = [SELECT id, color__c FROM Training_Track__c LIMIT 1];

        //Check that the query was successful, the training track is not null
        System.assertNotEquals(newTrack,null);

        //Check that the Color field has been filled
        System.assertNotEquals(newTrack.Color__c,null);

    }
}
