/*****************************************************
* afTrainingBatchesApexController Test Class
* Author: Sergey Sambros
*
* Tests the Apex Controller for the afTrainingBatches
*   component. 27/27 lines covered
*****************************************************/

@isTest
public class afTrainingBatchesApexControllerTest {
	
    @testSetup 
    public static void testDataSetup() {

        //Setup test data: Locations, Training Tracks, Trainings, User
        //UtilityMethods is last method in this class
        List<Training_Location__c> testL = UtilityMethods.createLocationData(6);
        List<User> testU = UtilityMethods.createUserData(3);       
        List<Training_Track__c> testT = UtilityMethods.createTrainingTrackData(3);
        List<Training__c> testTr = UtilityMethods.createTrainingsData(9, testL, testU,                                          
                                           UtilityMethods.createStartDateData(9), testT);
        //below prevents mixed dml error 
        insert testU;
        System.runAs(testU[0]){
            insert testT;
            insert testL;
            insert testTr;            
        }
    }
       
    @isTest
    public static void doTest() { 

        List <Training__c> AllTrainings = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, 
                                                  TrainingTrack__r.ShortName__c,
                                                  Status__c, TrainingClass__c, StartDate__c, 
                                                  EndDate__c, Trainer__r.Name, CoTrainer__r.Name
                                           FROM Training__c
                                           ORDER BY StartDate__c];

        //test that the soql queries in the controller are as expected
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.AllTrainings);
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.currentTrainings);

        //test getter
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.getTrainingBatches());
        
        //select 2 batches to test
        List<Training__c> testTrainings = [SELECT Id FROM Training__c LIMIT 2];

        String[] batchIds = new string[]{};

        for(integer i = 0; i < testTrainings.size(); i++) {
            batchIds.add(testTrainings[i].id);
        }

        //delete 2 batches
        afTrainingBatchesApexController.deleteBatchesServer(batchIds);
         
        //confirm that 2 batches were deleted 
        system.assertEquals([SELECT Id FROM Training__c].size(), afTrainingBatchesApexController.AllTrainings.size());

        //set a training start date to enter condition loop for null start date
       	//reset property
        afTrainingBatchesApexController.AllTrainings = null;
        List<Training__c> newTrainingsList = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, 
                                                     TrainingTrack__r.ShortName__c,
                                                     Status__c, TrainingClass__c, StartDate__c, 
                                                     EndDate__c, Trainer__r.Name, CoTrainer__r.Name
                                              FROM Training__c];

        newTrainingsList[0].StartDate__c = null;

        //record EndDate to later assert
        Date nullTest = newTrainingsList[0].EndDate__c;

        system.assertEquals(newTrainingsList.size(), afTrainingBatchesApexController.AllTrainings.size()); 

        afTrainingBatchesApexController.updateBatchesServer(newTrainingsList);

        system.assertEquals(newTrainingsList.size(), afTrainingBatchesApexController.AllTrainings.size());

        //negative case, start date = null, assert that the end date is a day before when it began
        system.assertEquals(nullTest.addDays(-1),newTrainingsList[0].EndDate__c);

        //test get trainers by id
        User testUser = [Select id From USER LIMIT 1 OFFSET 2];
        system.assertEquals(afTrainingBatchesApexController.getTrainingBatchesById(testUser.Id),
                            [SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,
                                    Status__c, TrainingClass__c, StartDate__c, EndDate__c, 
                                    Trainer__r.Name, CoTrainer__r.Name
                            FROM Training__c 
                            WHERE Trainer__r.Id = :testUser.id]);
                            
    }   

}