@isTest
public class AssignForceTestClass{
    

    @testSetup
    public static void AssignForceDataSetup(){
        ApexTestUtilityClass.createTrainingsData(7);
        ApexTestUtilityClass.createTrainingRoomData(5);
        ApexTestUtilityClass.createNewTrainingTrack();
        ApexTestUtilityClass.createSkills(5);
        List<User> usersToCreate = new List<User>();
        usersToCreate.add(ApexTestUtilityClass.getUserData());
        usersToCreate.add(ApexTestUtilityClass.getUserData());
        insert usersToCreate;
        //ApexTestUtilityClass.createManagers();
        //ApexTestUtilityClass.createPTOs(50);        
    }
    


    //afTimelineController Tests START
    @isTest
    public static void afTimelineControllerTest(){
        List<Training__c> actual = [SELECT Id, Name, TrainingLocation__c, Trainer__r.Name, StartDate__c, 
                                    TrainingLocation__r.OfficeName__c, EndDate__c, 
                                    CoTrainer__r.name, TrainingTrack__r.ShortName__c,
                                    TrainingTrack__r.Color__c,
                                    TrainingClass__c FROM Training__c ORDER BY Trainer__r.name, StartDate__c];
        //test AllTrainings
        List<Training__c> trainings = afTimeLineController.AllTrainings;
        system.assertEquals(actual, trainings);
        //test currentTrainings
        List<Training__c> curTrainings = afTimeLineController.currentTrainings;
        system.assertEquals(actual, curTrainings);
        
        List<User> trainers =[SELECT Name 
                              FROM User 
                              WHERE UserRole.Name = 'Trainer' OR UserRole.Name = 'CoTrainer'
                              ORDER BY Name];
        //test trainers
        List<User> trainersTest = afTimeLineController.trainers;       
        system.assertEquals(trainers, trainersTest);       
        
        String[] getTrainers = new String[]{};
		for(User u : trainers)
        { 
            Boolean trainerInTrainings = false;
            for(Training__c t : afTimeLineController.currentTrainings){   
                if(u.Name == t.Trainer__r.Name){
                    trainerInTrainings = true;
                    getTrainers.add(u.Name);
                    break;
                } 
            }
        }
        
        String[]getTrainerNames = afTimeLineController.getTrainers();
        system.assertEquals(getTrainers, getTrainerNames);
        
        List<ApexTestUtilityClass.TrainingDataWrapperTest> trainerData = new List<ApexTestUtilityClass.TrainingDataWrapperTest>();
        Map<Integer,String> trainerNumbersNames = new Map<Integer,String>();
        List<String> trainerNames = new List<String>();
        Integer trainerNumber = 0;
        Integer trainerIndex = 0;
        Integer j = 0;
        for(Training__c t : actual){
            Boolean trainerInMap = false;
            ApexTestUtilityClass.TrainingDataWrapperTest tdw = new ApexTestUtilityClass.TrainingDataWrapperTest();
            for(j = 0 ; j < trainerNames.size() ; j++){   
                if(trainerNames[j] == t.Trainer__r.Name){
                    tdw.y = j;
                    trainerInMap = true;
                    break;
                } 
            }
            if(!trainerInMap){
                trainerNames.add(t.Trainer__r.Name);
                tdw.y = trainerNumber;
                trainerNumber++;
            }
            tdw.x = t.StartDate__c;
            tdw.x2 = t.EndDate__c;
            tdw.series = t.TrainingTrack__r.ShortName__c;
            tdw.color = t.TrainingTrack__r.Color__c;
            tdw.trainerName = t.Trainer__r.Name;
            trainerData.add(tdw);
        }
        String trainerDataTest = System.json.serialize(trainerData);
        string trainerDataServer = afTimelineController.wrapTrainingToJSON();
        
        system.assertEquals(trainerDataTest, trainerDataServer);
        
        
        List<Training__c> NewTrainings = new List<Training__c>();
        List<Integer> monthList = new List<Integer>();
        
        //positive test case
        String[] test = new String[]{'Tampa', 'Washington', 'Reston'};
            system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, 2, 2), 
                                afTimelineController.filterTrainingsByYearLocationQuarter(test, 2, 2));       
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, 1, 3), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(test, 1, 3));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, 2, 4), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(test, 2, 4));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, 3, 5), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(test, 3, 5));
        //negative test Case
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(null, 2, 1), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(null, 2, 1));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, null, 1), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(test, null, 1));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, 1, null), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(test, 1, null));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(null, 3, null), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(null, 3, null));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, null, null), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(test, null, null));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(null, null, null), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(null, null, null));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationQuarterTest(test, 3, 5), 
                            afTimelineController.filterTrainingsByYearLocationQuarter(test, 3, 5));
        
        //positive case
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationTest(test, 1), 
                            afTimelineController.filterTrainingsByYearLocation(test, 1));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationTest(test, 2), 
                            afTimelineController.filterTrainingsByYearLocation(test, 2));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationTest(test, 3), 
                            afTimelineController.filterTrainingsByYearLocation(test, 3));
        //negative case
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationTest(null, 3), 
                            afTimelineController.filterTrainingsByYearLocation(null, 3));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationTest(test, null), 
                            afTimelineController.filterTrainingsByYearLocation(test, null));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearLocationTest(null, null), 
                            afTimelineController.filterTrainingsByYearLocation(null, null));
        
        //positive case
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearTest(1), afTimelineController.filterTrainingsByYear(1));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearTest(2), afTimelineController.filterTrainingsByYear(2));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearTest(3), afTimelineController.filterTrainingsByYear(3));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearTest(4), afTimelineController.filterTrainingsByYear(4));
        
        //negative case
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearTest(null), afTimelineController.filterTrainingsByYear(null));
        //system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearTest(4), afTimelineController.filterTrainingsByYear(4));
        //system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearTest(-1), afTimelineController.filterTrainingsByYear(-1));
        
        String[] test1 = afTimelineController.getTrainingLocations();
        system.assertEquals(ApexTestUtilityClass.getTrainingLocationsTest(actual), test1);
        
        //positive case
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearQuarterTest(1,2), 
                            afTimelineController.filterTrainingsByYearQuarter(1,2));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearQuarterTest(2,3), 
                            afTimelineController.filterTrainingsByYearQuarter(1,2));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearQuarterTest(3,4), 
                            afTimelineController.filterTrainingsByYearQuarter(3,4));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearQuarterTest(3,5), 
                            afTimelineController.filterTrainingsByYearQuarter(3,5));
        
        //negative case
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearQuarterTest(null,2), 
                            afTimelineController.filterTrainingsByYearQuarter(null,2));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearQuarterTest(2,null), 
                            afTimelineController.filterTrainingsByYearQuarter(1,null));
        system.assertEquals(ApexTestUtilityClass.filterTrainingsByYearQuarterTest(null,null), 
                            afTimelineController.filterTrainingsByYearQuarter(null,null));
    }
    



    @isTest
    public static void afAvailListContainerApexControllerTest(){
        List<Training_Room__c> allRoomsTest = [SELECT Id, name, TrainingLocation__c, TrainingLocationName__c, AVAvailability__c, RoomCapacity__c
                                               FROM Training_Room__c
                                               ORDER BY name];
        
        List<Training_Room__c> testRooms = afAvailListContainerApexController.allRooms;
        system.assertEquals(allRoomsTest, testRooms);
        
        List<User> TrainersTest = [SELECT Id, Name, Available__c
                                   FROM User 
                                   WHERE UserRole.Name = 'Trainer' OR UserRole.Name = 'CoTrainer'];
        
        List<User> trainers = afAvailListContainerApexController.Trainers;
        system.assertEquals(TrainersTest, trainers);
        
        system.assertEquals(ApexTestUtilityClass.getRooms(allRoomsTest), afAvailListContainerApexController.getRooms());
        system.assertEquals(ApexTestUtilityClass.getAllTrainers(TrainersTest), afAvailListContainerApexController.getAllTrainers());
        
        system.assertEquals(ApexTestUtilityClass.getAllSkills(), afAvailListContainerApexController.getAllSkills());
        system.assertEquals(ApexTestUtilityClass.getAllTrainings(), afAvailListContainerApexController.getAllTrainings());
        
        
    }


    
    @isTest
    public static void afNewBatchFormApexControllerTest(){
        List<Training_Room__c> rooms = [SELECT Id, Name, TrainingLocation__c
                                        FROM Training_Room__c];
        system.assertEquals(rooms, afNewBatchFormApexController.allRooms(null));
        
        List<Training__c> trngList = [SELECT Id, Name, TrainingTrack__c, StartDate__c, EndDate__c, CreatedDate, TrainingRoom__c, Trainer__c, CoTrainer__c 
                                      FROM Training__c
                                      WHERE EndDate__c >= TODAY];
        
        system.assertEquals(trngList, afNewBatchFormApexController.allTrainings());
    }
    


    @isTest
    public static void afTrainingBatchesApexControllerTest(){
        List <Training__c> AllTrainings = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,
                                           Status__c, TrainingClass__c, StartDate__c, EndDate__c, Trainer__r.Name, CoTrainer__r.Name
                                           FROM Training__c
                                           ORDER BY StartDate__c];
        
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.AllTrainings);
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.currentTrainings);
        system.assertEquals(AllTrainings, afTrainingBatchesApexController.getTrainingBatches());
        List<Training__c> testTrainings = [SELECT Id FROM Training__c LIMIT 2];
        String[] batchIds = new string[]{};
        for(integer i = 0; i < testTrainings.size(); i++){
            batchIds.add(testTrainings[i].id);
        }
        
        afTrainingBatchesApexController.deleteBatchesServer(batchIds);
        afTrainingBatchesApexController.AllTrainings = null;
        List<Training__c> newTrainingsList = [SELECT Id, Name, TrainingLocation__r.OfficeName__c, TrainingTrack__r.ShortName__c,
                                           Status__c, TrainingClass__c, StartDate__c, EndDate__c, Trainer__r.Name, CoTrainer__r.Name
                                           FROM Training__c];
        system.assertEquals(newTrainingsList.size(), afTrainingBatchesApexController.AllTrainings.size()); 
        afTrainingBatchesApexController.updateBatchesServer(newTrainingsList);
    }



    
    @isTest
    public static void afTrainingTriggerTest(){
        List<Training__c> AllTrainings = [SELECT Id, Status__C From Training__c];
        for(integer i = 0; i < AllTrainings.size(); i++){
            AllTrainings[i].Status__c = 'Completed';
        }
        update AllTrainings;
    }


    
   @isTest
   public static void triggerTest(){
       
       List<User> Trainers = [SELECT Id, Name FROM User WHERE UserRole.name ='Trainer'];
       Id TrainerId = Trainers[0].Id;
       Id CotrainerId = Trainers[1].Id;
       Training__c training1;
       Training__c training2;
       Training__c trainingToInsert =new Training__c(Trainer__c=TrainerId, Cotrainer__c=CotrainerId, TargetCapacity__c = 99);
       insert trainingToInsert;
       System.runAs(Trainers[0]){
        training1 = [SELECT Trainer__c FROM Training__c WHERE TargetCapacity__c = 99 LIMIT 1];
       }
       System.runAs(Trainers[1]){
        training2 = [SELECT CoTrainer__c FROM Training__c WHERE TargetCapacity__c = 99 LIMIT 1];
       }
       System.assertEquals(training1.Trainer__c, TrainerId);
       System.assertEquals(training2.CoTrainer__c, CotrainerId);
   }

   
    
  /* @isTest
   public static void afTrainerInfoControllerTest(){      
      User tempUser = [SELECT Id, CreatedById FROM User LIMIT 1];
      ContentDocument doc = [SELECT Id, Title FROM ContentDocument WHERE CreatedbyId = :tempUser.CreatedById ORDER BY CreatedDate DESC LIMIT 1];
       System.debug('doc: ' + doc);
       system.assertEquals(doc, afTrainerInfoController.getFile(tempUser.CreatedById));*/
   //}
    
  /* @isTest
   static void PTOTabGetAllPTOs(){
       List<PTO__c> testPTO = [SELECT Id, Status__c, StartDate__c FROM PTO__c ORDER BY StartDate__c];
       List<PTO__c> actualPTO = afPTOTabsApexController.getAllPTOs(ApexTestUtilityClass.users.Id);
       System.assertEquals(testPTO,actualPTO);
   }*/
}