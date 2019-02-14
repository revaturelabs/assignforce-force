public class afTimelineController {
    
    @AuraEnabled
    public static String getListOfTrainingJSON(String[] trainers)
    {
        List<Training__c> trainings = [SELECT Id, Trainer__r.Name, StartDate__c, EndDate__c FROM Training__c];
        List<TrainingDataWrapper> trainerData = new List<TrainingDataWrapper>();
        Integer tIndex;
        System.debug('This is trainers: ' + trainers);
        
        for(Training__c t : trainings)
        {
            for(Integer i = 0; i < trainers.size(); i++)
            {
                if(t.Trainer__r.Name == trainers[i])
                {
                    tIndex = i;
                    TrainingDataWrapper tdw = new TrainingDataWrapper();
                    tdw.y = tIndex;
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
    public static String[] getTrainers()
    {
        system.debug('Am i being called?');
        List<User> trainers = [SELECT Name FROM User /*WHERE "This will be the trainer role" */];
        String[] trainerNames = new String[]{};
        for(User u : trainers)
        {
            System.debug('this is u'+ u);
            trainerNames.add(u.Name);
        }
        system.debug('this is trainer name '+ trainerNames);
        return trainerNames;
    }
    
}