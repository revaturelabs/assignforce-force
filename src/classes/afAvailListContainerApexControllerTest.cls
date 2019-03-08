@isTest
public class afAvailListContainerApexControllerTest {

    @testSetup
    public static void insertTestData(){
        Training_Location__c loc = new Training_Location__c();
        loc.OfficeName__c = 'testPlace';
        insert loc;
        List<Training_Room__c> testRooms = new List<Training_Room__c>();
        for(Integer i=0; i<60; i++){
            Training_Room__c tr = new Training_Room__c();
            if(math.mod(i, 3)==0){
                tr.AVAvailability__c='Yes';
            } else if(math.mod(i,3)==1){
                tr.AVAvailability__c='No';
            } else{
                tr.AVAvailability__c='Upon Request';
            }
            tr.TrainingLocation__c = [Select Id FROM Training_Location__c LIMIT 1].Id;
            testRooms.add(tr);
        }
        insert testRooms;
    }
    @isTest
    public static void testGetRooms(){
        System.assertEquals(60, afAvailListContainerApexController.getRooms().size());
        System.assertEquals('Yes', afAvailListContainerApexController.getRooms()[10].AVAvailability__c);
        System.assertEquals('No', afAvailListContainerApexController.getRooms()[21].AVAvailability__c);
        System.assertEquals('Upon Request', afAvailListContainerApexController.getRooms()[50].AVAvailability__c);
    }
    @isTest
    public static void testGetTrainers(){
        List<User> availableUsers = [SELECT Id, Name, Available__c
                                         FROM User 
                                         WHERE UserRole.Name = 'Trainer' OR UserRole.Name = 'CoTrainer' Order By Available__c];
        System.assertEquals(availableUsers, afAvailListContainerApexController.getAllTrainers());
        
    }
}