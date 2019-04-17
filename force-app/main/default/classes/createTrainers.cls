public class createTrainers {

    public static void createTrainers() {
        List<String> lastNames = new List<String> {'Alagna', 'Bonds', 'Colson', 'Donnelly', 'Goshorn', 'Greer', 'Higgens', 'Hill', 'Jurczak',
            'Knighten', 'Kumar', 'Lessley', 'Orr', 'Rehm', 'Trainer'};
        List<String> firstNames = new List<String> {'Peter', 'Genesis', 'Jessica', 'Quintin', 'Mitchell', 'Damon', 'Emily', 'Harvey', 'Nickolas',
            'Jason', 'Arun', 'Ryan', 'Richard', 'Carolyn', 'External'};
                        
        ID profID = [SELECT Id FROM Profile WHERE Name = 'Trainer' LIMIT 1].id;
        ID roleID = [SELECT id,name FROM UserRole WHERE name = 'Trainer' LIMIT 1].id;
        
        List<User> trainers = new List<User>();
        
        for (Integer i = 0; i < lastNames.size(); i++) {
            User u1 = new User(ProfileId=profID, LastName=lastNames[i], FirstName=firstNames[i], Email='assignforcerevature@gmail.com', username=lastNames[i] + '@HarryMitchellaf3.com', 
                               CompanyName='Revature', Title='Trainer', Alias=firstNames[i], TimeZoneSidKey='America/New_York', EmailEncodingKey='UTF-8',
                               LanguageLocaleKey='en_US',LocaleSidKey='en_US', Available__c='Available',UserRoleId=roleID, isActive=false);
            trainers.add(u1);
        }
        
        insert trainers;
    }
    
    public static void AssignLocations(){
        Schema.DescribeFieldResult locFr = User.CurrentLocation__c.getDescribe();
        Schema.DescribeFieldResult skillFr = User.Training_Skills__c.getDescribe();
        List<Schema.PicklistEntry> locPlEntries = locFr.getPicklistValues();
        List<Schema.PicklistEntry> skillPlEntries = skillFr.getPicklistValues();
        List<String> locNames = new List<String>();
        List<String> skillNames = new List<String>();

        for (Schema.PicklistEntry entry : locPlEntries){
            locNames.add(entry.getLabel());
        }
        for (Schema.PicklistEntry entry : skillPlEntries){
            skillNames.add(entry.getLabel());
        }
        Integer numLocs = locNames.Size();
        Integer numSkills = skillNames.Size();
        UserRole trainerRole = [select id, name from UserRole where name='Trainer'];
        
        List<User> usrs = [select id from User where UserRoleId=:trainerRole.Id];
        for (User usr : usrs){
            usr.CurrentLocation__c = locNames[Integer.valueof((Math.random() * numLocs))];
            usr.Training_Skills__c = skillNames[Integer.valueof((Math.random() * numSkills))];
        }
        
        update usrs;
    }
}