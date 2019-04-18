/********************************************************************
* afNewBatchAndAvailApexController Test Class
* Author: Ian Blanchard
*
* Test Class for the Master Apex Controller. This Apex Controller
*   provides the queries for the three components on the Batch tab
*   so that the database can be queried as few times as possible.
*********************************************************************/


@isTest 
public class afNewBatchAndAvailApexControllerTest {
    
    @TestSetup
    public static void doSetup(){

        //Create and Insert 200 Trainers
        List<User> trainers = UtilityMethods.createUserData(200);
        insert trainers;

        //Create and Insert 200 Locations
        List<Training_Location__c> locations = UtilityMethods.createLocationData(200);
        System.runAs(trainers.get(0)) { 
            insert locations;
        }

        //Create and Insert 200 Rooms and Tracks
        List<Training_Room__c> rooms = UtilityMethods.createRoomData(200,locations.get(0));
        List<Training_Track__c> tracks = UtilityMethods.createTrainingTrackData(200);
        System.runAs(trainers.get(0)) {
            insert tracks;
        }

        //Create and Insert 200 Skills and Trainings using the above Trainers, Tracks and Locations
        List<Skill__c> skills = UtilityMethods.createSkillData(200,trainers,tracks);
        List<Training__c> trainings = UtilityMethods.createTrainingsData(200,locations,trainers,new List<Date>{Date.newInstance(2019,3,18)},tracks);
        System.runAs(trainers.get(0)){
            insert rooms;
            insert skills;
            insert trainings;
        }
        
    }

    @isTest
    public static void doTest() {

        test.startTest();

        //Query for the lists inserted in Setup
        List<User> trainers = [SELECT id, Name, Available__c FROM User WHERE UserRole.Name = 'Trainer'];
        List<Training_Location__c> locations = [SELECT id, Name, OfficeName__c FROM Training_Location__c];
        List<Training_Room__c> rooms = [SELECT id, name, TrainingLocation__c, TrainingLocationName__c, AVAvailability__c, RoomCapacity__c FROM Training_Room__c];
        List<Skill__c> skills = [SELECT Training_Track__c, Trainer__c FROM Skill__c];
        List<Training__c> trainings = [SELECT id, Name, CreatedDate, CoTrainer__c, CoTrainer__r.name, 
                                              Trainer__c, Trainer__r.Name, TrainingTarget__c,
                                              TrainingLocation__c, TrainingLocation__r.OfficeName__c, 
                                              TrainingTrack__c, TrainingTrack__r.ShortName__c, TrainingTrack__r.Color__c, 
                                              TrainingClass__c, TrainingRoom__c, StartDate__c, EndDate__c 
                                       FROM Training__c
                                       WHERE Status__c != 'Completed' OR Status__c != 'Cancelled'];

        //Get the results from the Controller methods
        List<User> trainerResults = afNewBatchAndAvailabilityApexController.masterTrainers();
        List<Training_Room__c> roomResults = afNewBatchAndAvailabilityApexController.masterRooms();
        List<Training_Location__c> locationResults = afNewBatchAndAvailabilityApexController.masterLocations();
        List<Skill__c> skillResults = afNewBatchAndAvailabilityApexController.masterSkills();
        List<Training__c> trainingResults = afNewBatchAndAvailabilityApexController.masterOpenTrainings();

        Test.stopTest();

        //Check that the results from the Controller methods match the original lists.
        System.assertEquals(trainers.size(),trainerResults.size());
        System.assertEquals(rooms.size(),roomResults.size());
        System.assertEquals(locations.size(),locationResults.size());
        System.assertEquals(skills.size(),skillResults.size());
        System.assertEquals(trainings.size(),trainingResults.size());
    }

}