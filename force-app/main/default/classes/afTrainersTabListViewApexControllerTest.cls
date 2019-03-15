@isTest
public class afTrainersTabListViewApexControllerTest {

    @TestSetup
    public static void doSetup(){
        List<User> users = new List<User>();
        Id profileId = [SELECT Id FROM Profile WHERE Name = 'Trainer' LIMIT 1].id;
        Id roleId = [SELECT Id FROM UserRole WHERE Name = 'Trainer' LIMIT 1].id;

        //Create 10 trainers and insert them
        for (integer i = 0; i < 10; i++){
            User u = new User(
            ProfileId = profileId,
            LastName = 'last ' + Math.round(Math.random()),
            Email = 'puser' + Math.round(Math.random()) + '@amamama.com',
            Username = 'puser' + Math.round(Math.random()) + '@amamama.com' + System.currentTimeMillis(),
            CompanyName = 'TEST',
            Title = 'title',
            Alias = 'alias',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            Available__c = 'Available',
            UserRoleId = roleId);
        }
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

        //Create and insert a TestTrack Training Track
        Training_Track__c track = new Training_Track__c(ShortName__c = 'TestTrack');
        insert track;

        //Create a list of 100 skill records
        List<Skill__c> skills = new List<Skill__c>();
        for (integer i = 0; i < 100; i++){
            //Set the skill track to the track created above and the user to the first Trainer in the list
            Skill__c sk = new Skill__c(Training_Track__c = track.id,
                                       Trainer__c = userResults.get(0).id);
            skills.add(sk);
        }

        //Insert list of skills
        insert skills;

        String results = afTrainersTabListViewApexController.getTrainerSkills(userResults.get(0).id);

        //Using a loop to construct the string that is expected to be returned by
        //      the getTrainerSkills method. There are 100 skills, so its going to be long
        String expected = 'TestTrack';
        for (integer i = 0; i < 99; i++){
            expected += ', TestTrack';
        }

        //Check that the results from the Controller method call for trainer skills
        //Matches the constructed Expected string
        System.assertEquals(results,expected);

        Test.stopTest();

    }

}
