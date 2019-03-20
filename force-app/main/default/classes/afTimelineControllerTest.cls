/****************************************************************
 * Tests the afTimeLineController class and all of its methods. *
 * Author: Rafael E. López M.                                   *
 * Last Modified: Mar 15, 2019                                  *
 ****************************************************************/

@isTest
public class afTimelineControllerTest {

    // Constant variables whose data would be better off as a static resource
    private static final String testTrainingQuery = 'SELECT Id, Name, TrainingLocation__c, Trainer__r.Name,'+
        'StartDate__c, TrainingLocation__r.OfficeName__c, EndDate__c, CoTrainer__r.name, TrainingTrack__r.ShortName__c,'+
        'TrainingTrack__r.Color__c, TrainingClass__c FROM Training__c ORDER BY Trainer__r.name, StartDate__c';

    // Test data variables
    private static List<User> users;
    private static List<Training__c> trainings;
    private static List<Training_Location__c> locations;
    private static List<Date> sDates;
    private static List<Training_Track__c> tracks;

    @TestSetup
    static void makeData(){

        // Generate test data
        users = createUserData();
        sDates = createStartDateData();
        tracks = createTrainingTrackData();
        locations = createLocationData();
        trainings = createTrainingsData();

        Database.insert(users);
        //Database.insert(sDates);
        Database.insert(tracks);
        Database.insert(locations);
        Database.insert(trainings);

    }
    
    @isTest
    public static void AllTrainings_Getter_Test(){
        // Arrange
        List<Training__c> allTrainings;
        List<Training__c> actualTrainings = Database.query(testTrainingQuery);

        // Act
        allTrainings = afTimeLineController.AllTrainings;

        // Assert
        system.assertEquals(actualTrainings, allTrainings);
                
    }

    // TODO consider removing currentTrainings alltogether since it just points to AllTrainings
    @isTest
    public static void currentTrainings_Getter_Test(){
        // Arrange
        List<Training__c> currTrainings;
        List<Training__c> actualTrainings = Database.query(testTrainingQuery);

        // Act
        currTrainings = afTimeLineController.currentTrainings;

        // Assert
        system.assertEquals(actualTrainings, currTrainings);
                
    }

    @isTest
    public static void trainers_Getter_Test(){
        // Arrange
        List<User> tstTrainers;
        List<User> actualTrainers = [SELECT Name
                                    FROM User
                                    WHERE UserRole.Name = 'Trainer'
                                        OR UserRole.Name = 'CoTrainer'
                                    ORDER BY Name];

        // Act
        tstTrainers = afTimeLineController.trainers;   

        // Assert       
        system.assertEquals(actualTrainers, tstTrainers);  
                
    }

    @isTest
    public static void getTrainingLocations_Test(){
        // Arrange
        String[] testLocations;
        String[] actualLocations = ApexTestUtilityClass.getTrainingLocationsTest(Database.query(testTrainingQuery));

        // Act
        testLocations = afTimeLineController.getTrainingLocations();

        // Assert
        System.AssertEquals(actualLocations, testLocations);
                
    }

    // @isTest
    // public static void getTrainers_Test(){
    //     // Arrange

    //     // Act

    //     // Assert
                
    // }

    // @isTest
    // public static void filterTrainingsByYearLocationQuarter_Test(){
    //     // Arrange

    //     // Act

    //     // Assert
        
    // }

    // @isTest
    // public static void filterTrainingsByYearLocation_Test(){
    //     // Arrange

    //     // Act

    //     // Assert
        
    // }

    // @isTest
    // public static void filterTrainingsByYear_Test(){
    //     // Arrange

    //     // Act

    //     // Assert
        
    // }

    // @isTest
    // public static void filterTrainingsByYearQuarter_Test(){
    //     // Arrange

    //     // Act

    //     // Assert
        
    // }

    /***********************************************
     * Utility methods to create mock testing data *
     ***********************************************/

    // Create dummy Training__c's and return them in a List.
    private static List<Training__c> createTrainingsData(){
        Integer numberToCreate = 10;
        List<Training__c> dummyData = new List<Training__c>();
        for(integer i = 0; i < numberToCreate; i++){
            Training__c newM = new Training__c();
            newM.TrainingLocation__c = locations[i].id;
            newM.Trainer__r = users[i];
            newM.StartDate__c = sDates[i];
            newM.EndDate__c = newM.StartDate__c + 10;
            if(Math.mod(i, 2) == 0) {
                newM.CoTrainer__r = users[i+1];
            }
            newM.TrainingTrack__c = tracks[i].id;
            
            dummyData.add(newM);
        }
        return dummyData;
    }

    // Create dummy Users and return them in a List.
    private static List<User> createUserData(){

        // User uData = new User(
        //     // @TODO replace query with generated 
        //     ProfileId = [SELECT Id FROM Profile WHERE Name = 'Trainer' LIMIT 1].id,
        //     LastName = 'last ' + Math.round(Math.random()),
        //     Email = 'puser' + Math.round(Math.random()) + '@amamama.com',
        //     Username = 'puser' + Math.round(Math.random()) + '@amamama.com' + System.currentTimeMillis(),
        //     CompanyName = 'TEST',
        //     Title = 'title',
        //     Alias = 'alias',
        //     TimeZoneSidKey = 'America/Los_Angeles',
        //     EmailEncodingKey = 'UTF-8',
        //     LanguageLocaleKey = 'en_US',
        //     LocaleSidKey = 'en_US',
        //     Available__c = 'Available',
        //     UserRoleId = uID);

        // return uData;
        return null;
    }

    // Create dummy Training_Location__c's and return them in a List.
    private static List<Training_Location__c> createLocationData(){
        return null;
    }

    // Create dummy Date objects and return them in a List.
    private static List<Date> createStartDateData(){
        return null;
    }
    
    // Create dummy Training_Track__c's and return them in a List.
    private static List<Training_Track__c> createTrainingTrackData(){
        return null;
    }

}