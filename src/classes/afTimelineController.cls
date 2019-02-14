public class afTimelineController {
    
    public static List<Training__c> AllTrainings
    {
        get{
            if(AllTrainings == null)
            {
                AllTrainings = [SELECT Id, Name, TrainingLocation__c, Trainer__r.Name, StartDate__c, 
                                EndDate__c,
                                CoTrainer__r.name, TrainingTrack__r.name,
                                TrainingClass__c FROM Training__c ORDER BY Trainer__r.name];
            }
            
            return AllTrainings;
        }
        set;
    }
    
    @AuraEnabled
    public static List<Training__c> currentTrainings
    {
        get{
            if(currentTrainings == null)
            {
                currentTrainings = AllTrainings;
            }
            return currentTrainings;
        }
        set;
    }
    
    public static List<User> trainers {
        get{
            if(trainers == null){
                trainers =  [SELECT Name 
                             FROM User /*WHERE "This will be the trainer role" */];
            }
            return trainers;
        }
        set;
    } 
    
    @AuraEnabled
    public static String[] getTrainers()
    {
        String[]trainerNames;
        trainerNames = new String[]{};
            for(User u : trainers)
        {
            trainerNames.add(u.Name);
        }
        return trainerNames;
    }
    
    @AuraEnabled
    public static String wrapTrainingToJSON()
    {
        List<TrainingDataWrapper> trainerData = new List<TrainingDataWrapper>();
        System.debug('This is trainers: ' + trainers);
        
        for(Training__c t : currentTrainings){
            for(Integer i = 0; i < getTrainers().size(); i++)
            { 
                if(t.Trainer__r.name == getTrainers()[i]){
                    TrainingDataWrapper tdw = new TrainingDataWrapper();
                    tdw.y = i;
                    tdw.x = t.StartDate__c;
                    tdw.x2 = t.EndDate__c;
                    trainerData.add(tdw); 
                }
            }
        }
        
        system.debug(trainerData);
        return System.json.serialize(trainerData);
        
    }
    
    public class TrainingDataWrapper
    {
        @AuraEnabled
        public Integer y;
        @AuraEnabled
        public Date x;
        @AuraEnabled
        public Date x2;
    }
    
    @AuraEnabled
    public static void filterTrainings(String[] location, Integer year, Integer month)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        for(Training__c t : currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            for(String s : location)
            {
                if(t.TrainingLocation__c == s && year == trainingYear && month == trainingMonth)
                {
                    NewTrainings.add(t);
                }
            }
        }
        currentTrainings = NewTrainings;
    }
    
    @AuraEnabled
    public static void filterTrainings(String[] location, Integer yearOrMonth)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        /*Integer year;
Integer month;
String yearOrMonthString = String.valueOf(yearOrMonth);
if(yearOrMonthString.length() == 4)
{
year = yearOrMonth;
}
else if(yearOrMonthString.length() == 2)
{
month = yearOrMonth;
}*/
        for(Training__c t : currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            for(String s : Location)
            {
                if(t.TrainingLocation__c == s && (yearOrMonth == trainingYear || yearOrMonth == trainingMonth))
                {
                    NewTrainings.add(t);
                }
            }
        }
        currentTrainings = NewTrainings;
    }
    
    
    @AuraEnabled
    public static void filterTrainings(String[] Location)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        for(Training__c t : currentTrainings)
        {
            for(String s : Location)
            {
                if(t.TrainingLocation__c == s)
                {
                    NewTrainings.add(t);
                }
            }
        }
        currentTrainings = NewTrainings;
    }
    
    @AuraEnabled
    public static void filterTrainings(Integer yearOrMonth)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        for(Training__c t : currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            
            if((yearOrMonth == trainingYear || yearOrMonth == trainingMonth))
            {
                NewTrainings.add(t);
            }
        }
        currentTrainings = NewTrainings;
    }    
}