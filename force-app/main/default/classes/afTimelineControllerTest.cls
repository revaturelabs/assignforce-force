@isTest
public class afTimelineControllerTest {

    private static final String testTrainingQuery = 'SELECT Id, Name, TrainingLocation__c, Trainer__r.Name,'+
        'StartDate__c, TrainingLocation__r.OfficeName__c, EndDate__c, CoTrainer__r.name, TrainingTrack__r.ShortName__c,'+
        'TrainingTrack__r.Color__c, TrainingClass__c FROM Training__c ORDER BY Trainer__r.name, StartDate__c';

    @TestSetup
    static void makeData(){

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
}
