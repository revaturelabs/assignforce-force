/**********************************************
* afNewBatchFormApexController Test Class
* Author: Ian Blanchard
*
* Tests the methods of the Apex Controller for 
*   the afNewBatchForm component
*
**********************************************/

@isTest
public class afNewBatchFormApexControllerTest {
    
    @isTest
    public static void doTest() {

        //Create 2 locations. One we will be testing for, the other will be filtered out by the
        //      controllers method.
        Training_Location__c testLocation = new Training_Location__c(OfficeName__c = 'Test Location');
        Training_Location__c otherLocation = new Training_Location__c(OfficeName__c = 'Other Location');

        //Insert locations
        insert testLocation;
        insert otherLocation;

        //Create 200 rooms at each location
        List<Training_Room__c> testRooms = UtilityMethods.createRoomData(200,testLocation);
        List<Training_Room__c> otherRooms = UtilityMethods.createRoomData(200,otherLocation);

        //Insert all 400 rooms
        insert testRooms;
        insert otherRooms;

        //Query for all rooms
        List<Training_Room__c> allRooms = [SELECT id, TrainingLocationName__c FROM Training_Room__c];

        //Use the controllers method to filter for only rooms at the test location
        List<Training_Room__c> results = afNewBatchFormApexController.filterRoomByLocation(testLocation.OfficeName__c, allRooms);

        //Check the number of rooms returned by the controller method. There are 200 rooms that should meet the criteria
        //      but we must assert that the size is 201 because the controller adds an additional empty Room sObject to the
        //      beginning of the list as a default value.
        System.assertEquals(results.size(), 201);

        //Use the controllers method again to filter for only rooms at the other location
        results = afNewBatchFormApexController.filterRoomByLocation(otherLocation.OfficeName__c, allRooms);

        //There are 200 rooms at the other location, and the method adds an empty Room sObject to the list. So again, the
        //      size of the results list should be 201.
        System.assertEquals(results.size(), 201);

        //Use the controller one more time for the negative test case. This time we are filtering by a location
        //      that does not exist.
        results = afNewBatchFormApexController.filterRoomByLocation('Invalid Location', allRooms);

        //Even though the location does not exist, the empty room sObject still gets added to the filter results.
        System.assertEquals(results.size(), 1);

    }
}