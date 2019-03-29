/*************************************************
* afTrainersTabListViewApexController Test Class
* Author: Ian Blanchard
*
* Tests the methods of the Apex Controller for 
*   the afTrainersTabListView component
*
*************************************************/

@isTest
public class afTrainersTabListViewApexControllerTest {

    @TestSetup
    public static void doSetup(){

        List<User> users = UtilityMethods.createUserData(10);
        insert users;

    }

    @isTest
    public static void doTest() {

        Test.startTest();

        //Query for the Users created, and also use the Controller method to do so
        List<User> users = [SELECT id FROM User WHERE UserRole.name = 'Trainer'];
        List<User> userResults = afTrainersTabListViewApexController.allTrainers();

        //Check that the controller method returns the same list as the query
        System.assertNotEquals(userResults,null);
        System.assertEquals(users.size(),userResults.size());

        //Create and insert 100 Training Tracks
        List<Training_Track__c> tracks = UtilityMethods.createTrainingTrackData(100);
        insert tracks;

        //Create and insert 100 skills for one user
        List<Skill__c> skills = UtilityMethods.createSkillData(100, new User[]{userResults.get(0)}, tracks);
        insert skills;

        String results = afTrainersTabListViewApexController.getTrainerSkills(userResults.get(0).id);

        //Using a loop to construct the string that is expected to be returned by
        //      the getTrainerSkills method. There are 100 skills, so its going to be long
        String expected = 'Track0';
        for (integer i = 1; i < 100; i++){
            expected += ', Track' + i;
        }

        //Check that the results from the Controller method call for trainer skills
        //Matches the constructed Expected string
        System.assertEquals(results,expected);

        Test.stopTest();

    }

}