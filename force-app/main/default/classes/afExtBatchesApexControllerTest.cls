@isTest
public class afExtBatchesApexControllerTest {

    private static List<Training_Location__c> locations;
    private static List<External_Trainer__c> xtrainers;
    private static List<Training_Track__c> tracks;
    private static List<Training__c> trainings;


    @TestSetup
    public static void doSetup(){

        //Setup test data: Locations, Training Tracks, Trainings, User
        //UtilityMethods is last method in this class
        locations = UtilityMethods.createLocationData(6);
        xtrainers = UtilityMethods.createExternalTrainerData(3);       
        tracks = UtilityMethods.createTrainingTrackData(3);
        trainings = UtilityMethods.createExternalTrainingsData(9, locations, xtrainers, UtilityMethods.createStartDateData(9), tracks);

        insert xtrainers;
        insert locations;
        insert tracks;
        insert trainings;       

    }
    
    @isTest
    public static void doTest(){

        List <Training__c> AllTrainings = [SELECT Id, Name, TrainingTrack__r.ShortName__c, Status__c, TrainingClass__c, StartDate__c, 
                                                  EndDate__c, External_Trainer__r.First_Name__c, External_Trainer__r.Last_Name__c
                                          FROM Training__c
                                          ORDER BY StartDate__c];

        //test that the soql queries in the controller are as expected
        system.assertEquals(AllTrainings, afExternalTrainerBatchesApexController.AllExternalTrainings);
        system.assertEquals(AllTrainings, afExternalTrainerBatchesApexController.currentExternalTrainings);

        //test getter
        system.assertEquals(AllTrainings, afExternalTrainerBatchesApexController.getExtTrainingBatches());
        
        //select 2 batches to test
        List<Training__c> testTrainings = [SELECT Id FROM Training__c LIMIT 2];

        String[] batchIds = new string[]{};

        for(integer i = 0; i < testTrainings.size(); i++) {
            batchIds.add(testTrainings[i].id);
        }

        //delete 2 batches
        afExternalTrainerBatchesApexController.deleteExtBatchesServer(batchIds);
         
        //confirm that 2 batches were deleted. there were originally 9, so now there should be 7
        system.assertEquals([SELECT Id FROM Training__c].size(), afExternalTrainerBatchesApexController.currentExternalTrainings.size());

        //set a training start date to enter condition loop for null start date
       	//reset property
        afExternalTrainerBatchesApexController.AllExternalTrainings = null;
        List<Training__c> newTrainingsList = [SELECT Id, Name, TrainingTrack__r.ShortName__c, Status__c, TrainingClass__c, StartDate__c, 
                                                     EndDate__c, External_Trainer__r.First_Name__c, External_Trainer__r.Last_Name__c
                                              FROM Training__c
                                              ORDER BY StartDate__c];

        newTrainingsList[0].StartDate__c = null;

        //record EndDate to later assert
        Date nullTest = newTrainingsList[0].EndDate__c;

        system.assertEquals(newTrainingsList.size(), afExternalTrainerBatchesApexController.AllExternalTrainings.size()); 

        afExternalTrainerBatchesApexController.updateExtBatchesServer(newTrainingsList);

        system.assertEquals(newTrainingsList.size(), afExternalTrainerBatchesApexController.AllExternalTrainings.size());

        //negative case, start date = null, assert that the end date is a day before when it began
        system.assertEquals(nullTest.addDays(-1),newTrainingsList[0].EndDate__c);

        //test get trainers by id
        External_Trainer__c testUser = [SELECT id FROM External_Trainer__c LIMIT 1];
        system.assertEquals(afExternalTrainerBatchesApexController.getExtTrainingBatchesById(testUser.Id),
                            [SELECT Id, Name, TrainingTrack__r.ShortName__c, Status__c, TrainingClass__c, StartDate__c, 
                                    EndDate__c, External_Trainer__r.First_Name__c, External_Trainer__r.Last_Name__c
                            FROM Training__c 
                            WHERE Trainer__r.Id = :testUser.id]);

    }
}