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
        
		List<User> usrs = [select id from User where UserRole.Name='Trainer'];
		for (User usr : usrs){
    		usr.CurrentLocation__c = locNames[Integer.valueof((Math.random() * numLocs))];
            usr.Training_Skills__c = skillNames[Integer.valueof((Math.random() * numSkills))];
		}
		
		update usrs;
    }
    
    public static void createExternalTrainers(){
        List<String> lastNames = new List<String> {'Mowbray', 'Rivers', 'Aufidius', 'Tyrrell', 'Ratcliffe', 'Andronicus', 'Montague', 'Lepidus', 'Brutus', 'Gurney', 'Bates', 'Lovell', 'Blunt'};
        List<String> firstNames = new List<String> {'Achilles', 'Donalbain', 'George', 'Hugh', 'Adriano', 'Mortimer', 'Caphis', 'Juno', 'Lychorinda', 'Alice', 'Silvia', 'Volumnia', 'Anna'};
        List<String> skills = new List<String>{'Appian BPM', 'Big Data/Hadoop', 'Business Analyst', 'Dynamics CRM', 'ETL/Informatics', 'Full Stack Java/JEE', 'Full Stack JTA', 'Microservices', 'Oracle Fusion Middleware', 'Other', 'Pega', 'Salesforce', 'System Admin', 'Web Tools'};
        List<String> locations = new List<String>{'Fairfax', 'SPS', 'Reston', 'UTA-ERB', 'USF-NEC', 'ASU', 'WVU-CBE', 'Queens', 'USF-SOC', 'Online', 'USF-BSN', 'UTA-PRS', 'UTA-K'};
        
            
        List<External_Trainer__c> trainers = new List<External_Trainer__c>();
        
        for (Integer i = 0; i < lastNames.size(); i++) {
            External_Trainer__c newTrainer = new External_Trainer__c();
            newTrainer.First_Name__c = firstNames[i];
            newTrainer.Last_Name__c = lastNames[i];
            newTrainer.Name = firstNames[i] + ' ' + lastNames[i];
            newTrainer.Training_Skills__c = skills[Integer.valueof((Math.random() * skills.size()))];
            newTrainer.Current_Location__c = locations[Integer.valueof((Math.random() * locations.size()))];
            newTrainer.Preferred_Location__c = locations[Integer.valueof((Math.random() * locations.size()))];
            trainers.add(newTrainer);
        }
        insert trainers;
    }
}