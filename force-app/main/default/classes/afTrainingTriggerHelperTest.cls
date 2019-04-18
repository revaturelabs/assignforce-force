/**********************************************
* afTrainingTriggerHelper Test Class
* Author: Ian Blanchard
*
* Tests the methods of the Helper Class for the
*   Training Trigger
**********************************************/

@isTest
public class afTrainingTriggerHelperTest {

    @TestSetup
    static void doSetup(){

        List<User> trainers = UtilityMethods.createUserData(200);
        insert trainers;

    }

    @isTest
    public static void doTest() {

        //Get all users and create a Training Location
        List<User> trainers = [SELECT id FROM User LIMIT 200];
        Training_Location__c loc = new Training_Location__c(OfficeName__c = 'TestLoc');


        /************************
        *  Single Case Testing  *
        ************************/

        // Begin Single-Case Testing
        Test.startTest();

        User trainer = trainers.get(0);
        User cotrainer = trainers.get(1);

        //Create two training tracks for testing
        Training_Track__c track = UtilityMethods.createTrainingTrackData(1).get(0);
        Training_Track__c track2 = UtilityMethods.createTrainingTrackData(1).get(0);
        insert track;
        insert track2;


        //Create a skill using each training track.
        //One for the trainer, one for the cotrainer
        Skill__c trainerSkill = new Skill__c(Trainer__c = trainer.id,
                                             Training_Track__c = track.id);
        Skill__c cotrainerSkill = new Skill__c(Trainer__c = cotrainer.id,
                                               Training_Track__c = track2.id);
        insert trainerSkill;
        insert cotrainerSkill;


        //Create a training with the trainer and cotrainer
        //Trainer has skill for this track
        //Cotrainer does NOT have skill for this track
        Training__c trainingA = new Training__c(Trainer__c = trainer.id,
                                               CoTrainer__c = cotrainer.id,
                                               TrainingTrack__c = track.id,
                                               TrainingLocation__c = loc.id,
                                               Status__c = 'Completed');
        insert trainingA;


        //Create a training with the trainer and cotrainer
        //Trainer does NOT have skill for this track
        //Cotrainer has skill for this track
        Training__c trainingB = new Training__c(Trainer__c = trainer.id,
                                               CoTrainer__c = cotrainer.id,
                                               TrainingTrack__c = track2.id,
                                               TrainingLocation__c = loc.id,
                                               Status__c = 'Completed');
        insert trainingB;


        /*************************
        * Single Case Assertions *
        *************************/

        //Check that the lists of skills are of size 2
        //Originally, they each had 1 skill. The trigger SHOULD have added a new skill for
        //each of the users based on the track they previously did not have a skill in
        List<Skill__c> trainerSkills = [SELECT id FROM Skill__c WHERE Trainer__c = :trainer.id];
        List<Skill__c> cotrainerSkills = [SELECT id FROM Skill__c WHERE Trainer__c = :cotrainer.id];
        System.assertEquals(trainerSkills.size(),2);
        System.assertEquals(cotrainerSkills.size(),2);





        /********************
        * Bulk Case Testing *
        ********************/

        // Create and insert 200 Training Tracks
        List<Training_Track__c> tracks = UtilityMethods.createTrainingTrackData(200);
        insert tracks;


        // Create and insert 200 skills
        List<Skill__c> skills = UtilityMethods.createSkillData(200,trainers,tracks);
        insert skills;

        List<Training__c> trainings = new List<Training__c>();
        for (integer i = 0; i < 200; i += 2){
            Training__c training1 = new Training__c(Trainer__c = trainers.get(i).id,
                                                    CoTrainer__c = trainers.get(i + 1).id,
                                                    TrainingTrack__c = tracks.get(i).id,
                                                    TrainingLocation__c = loc.id,
                                                    Status__c = 'Completed');
            trainings.add(training1);
            Training__c training2 = new Training__c(Trainer__c = trainers.get(i + 1).id,
                                                    CoTrainer__c = trainers.get(i).id,
                                                    TrainingTrack__c = tracks.get(i).id,
                                                    TrainingLocation__c = loc.id,
                                                    Status__c = 'Completed');
            trainings.add(training2);
        }
        insert trainings;



        /***********************
        * Bulk Case Assertions *
        ***********************/

        //Check the total number of skills in the database
        //Total should be 404. 400 because there are now 2 per user instead of one
        //  assuming the trigger works as intended, plus 4 more from the Single-Case
        //  Tests above that were not deleted
        List<Skill__c> allSkills = [SELECT id, trainer__c FROM Skill__c];
        System.assertEquals(allSkills.size(),404);


        //Check that the users have the read access they are supposed to.
        //The shareTrainings and executeSharing methods give read access for Trainings
        //To the trainer and cotrainer Users.
        Boolean viewAccess = [SELECT RecordId, HasReadAccess 
                                FROM  UserRecordAccess 
                                WHERE UserId = :trainers.get(0).id 
                                AND RecordId = :trainings.get(0).id].HasReadAccess;
        System.assert(viewAccess);
        viewAccess = [SELECT RecordId, HasReadAccess 
                                FROM  UserRecordAccess 
                                WHERE UserId = :trainers.get(0).id 
                                AND RecordId = :trainings.get(1).id].HasReadAccess;
        System.assert(viewAccess);
        viewAccess = [SELECT RecordId, HasReadAccess 
                                FROM  UserRecordAccess 
                                WHERE UserId = :trainers.get(1).id 
                                AND RecordId = :trainings.get(0).id].HasReadAccess;
        System.assert(viewAccess);
        viewAccess = [SELECT RecordId, HasReadAccess 
                                FROM  UserRecordAccess 
                                WHERE UserId = :trainers.get(1).id 
                                AND RecordId = :trainings.get(1).id].HasReadAccess;
        System.assert(viewAccess);
        

        
        Test.stopTest();

    }
}