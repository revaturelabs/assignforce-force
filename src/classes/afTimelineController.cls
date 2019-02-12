public class afTimelineController {
    
    @AuraEnabled
    public static String getListOfTrainingJSON()
    {
        List<Training__c> trainings = [SELECT Id, Trainer__r.Name, StartDate__c, EndDate__c FROM Training__c];
        List<String> trainers = new List<String>();
        List<TrainingDataWrapper> trainerData = new List<TrainingDataWrapper>();
        Integer tIndex;
        
        for(Training__c t : trainings)
        {
            if(trainers.contains(t.Trainer__r.Name)){
                tIndex = trainers.indexOf(t.Trainer__r.name);
            }
            else{
                trainers.add(t.Trainer__r.Name);
                tIndex = trainers.indexOf(t.Trainer__r.name);
            }
			TrainingDataWrapper tdw = new TrainingDataWrapper();
            tdw.y = tIndex;
            tdw.x = t.StartDate__c;
            tdw.x2 = t.EndDate__c;
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
    }

}