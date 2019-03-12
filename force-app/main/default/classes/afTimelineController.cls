public class afTimelineController {
    
    public static List<Training__c> AllTrainings
    {
        get{
            if(AllTrainings == null)
            {
                AllTrainings = [SELECT Id, Name, TrainingLocation__c, Trainer__r.Name, StartDate__c, 
                                TrainingLocation__r.OfficeName__c, EndDate__c, 
                                CoTrainer__r.name, TrainingTrack__r.ShortName__c,
                                TrainingTrack__r.Color__c,
                                TrainingClass__c FROM Training__c ORDER BY Trainer__r.Name, StartDate__c];
            }
            
            return AllTrainings;
        }
        set;
    }
    
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
                             FROM User 
                             WHERE UserRole.Name = 'Trainer' OR UserRole.Name = 'CoTrainer'
                             ORDER BY Name];
            }
            return trainers;
        }
        set;
    } 
    
    @AuraEnabled
    public static String[] getTrainingLocations()
    {
        String[] officeLocations = new String[]{};
            for(Training__c t : AllTrainings)
        {
            officeLocations.add(t.TrainingLocation__r.OfficeName__c);
        }
        return officeLocations;
    }
    
    @AuraEnabled
    public static String[] getTrainers()
    {
        String[]trainerNames;
        trainerNames = new String[]{};
            for(User u : trainers)
        { 
            Boolean trainerInTrainings = false;
            for(Training__c t : currentTrainings){   
                if(u.Name == t.Trainer__r.Name){
                    trainerInTrainings = true;
                    trainerNames.add(u.Name);
                    break;
                } 
            }
        }
        return trainerNames;
    }
    
    @AuraEnabled
    public static String wrapTrainingToJSON()
    {
        List<TrainingDataWrapper> trainerData = new List<TrainingDataWrapper>();
        Map<Integer,String> trainerNumbersNames = new Map<Integer,String>();
        List<String> trainerNames = new List<String>();
        Integer trainerNumber = 0;
        Integer trainerIndex = 0;
        Integer j = 0;
        for(Training__c t : currentTrainings){
            Boolean trainerInMap = false;
            TrainingDataWrapper tdw = new TrainingDataWrapper();
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
        @AuraEnabled
        public String series;
        @AuraEnabled
        public String color;
        @AuraEnabled
        public String trainerName;
    }
    
    @AuraEnabled
    public static String filterTrainingsByYearLocationQuarter(String[] location, Integer year, Integer quarter)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        List<Integer> monthList = new List<Integer>();        
        switch on(quarter)
        {
            when 2
            {
                monthList.add(01);
                monthList.add(02);
                monthList.add(03);
            }
            
            when 3
            {
                monthList.add(04);
                monthList.add(05);
                monthList.add(06);
            }
            
            when 4
            {
                monthList.add(07);
                monthList.add(08);
                monthList.add(09);
            }
            
            when 5
            {
                monthList.add(10);
                monthList.add(11);
                monthList.add(12);
            }
            
            when else
            {
                return null;
            }
        }
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        for(Training__c t : currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            
            for(String s : location)
            {
                if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == trainingYear && monthList.contains(trainingMonth))
                {
                    NewTrainings.add(t);
                }
                else if(t.TrainingLocation__r.OfficeName__c == s && monthList.contains(trainingMonth) && convertedYear == null){
                    NewTrainings.add(t);
                }
            }
        }
        currentTrainings = NewTrainings;
        String trainerData = wrapTrainingToJSON();
        return trainerData;
    }
    
    @AuraEnabled
    public static String filterTrainingsByYearLocation(String[] location, Integer year)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        
        for(Training__c t : currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            
            for(String s : Location)
            {
                if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == trainingYear )
                {
                    NewTrainings.add(t);
                }
                else if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == null){
                    NewTrainings.add(t);
                }
            }
        }
        currentTrainings = NewTrainings;
        String trainerData = wrapTrainingToJSON();
        return trainerData;
    }
    
    
    @AuraEnabled
    public static String filterTrainingsByYearQuarter(Integer year, Integer quarter)
    {
        List<Integer> monthList = new List<Integer>(); 
        List<Training__c> NewTrainings = new List<Training__c>();
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        switch on(quarter)
        {
            when 2
            {
                monthList.add(01);
                monthList.add(02);
                monthList.add(03);
            }
            
            when 3
            {
                monthList.add(04);
                monthList.add(05);
                monthList.add(06);
            }
            
            when 4
            {
                monthList.add(07);
                monthList.add(08);
                monthList.add(09);
            }
            
            when 5
            {
                monthList.add(10);
                monthList.add(11);
                monthList.add(12);
            }
            
            when else
            {
                return null;
            }
        }
        for(Training__c t : currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            
            if(convertedYear == trainingYear && monthList.contains(trainingMonth))
            {
                NewTrainings.add(t);
            }
            else if(monthList.contains(trainingMonth) && convertedYear == null){
                NewTrainings.add(t);
            }
            
        }
        currentTrainings = NewTrainings;
        String trainerData = wrapTrainingToJSON();
        return trainerData;
    }
    
    @AuraEnabled
    public static String filterTrainingsByYear(Integer year)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        
        for(Training__c t : currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            
            if(convertedYear == trainingYear )
            {
                NewTrainings.add(t);
            }
            else if(convertedYear == null){
                NewTrainings.add(t);
            }
        }
        currentTrainings = NewTrainings;
        String trainerData = wrapTrainingToJSON();
        return trainerData;
    }
    
}