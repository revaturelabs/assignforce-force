trigger afTrainingTrigger on Training__c (after update, after insert) {
    
    if(trigger.isAfter && (trigger.isUpdate || trigger.isInsert)){
        List<Training__c> completedTrainings = new List<Training__c>();
        List<Training__c> newTrainingsToShare = new List<Training__c>();
        for(Training__c t : trigger.new){
            if(t.Status__c == 'Completed'){ // if the training is complete add them to the list
                completedTrainings.add(t);
            }
            if(t.Trainer__c != null || t.CoTrainer__c != null) {
                newTrainingsToShare.add(t);
            }
        }
        if(completedTrainings.isEmpty()==false) //checks to ensure there is something in the list of completed trainings
            afTrainingTriggerHelper.createSkills(completedTrainings);
        if(newTrainingsToShare.size() > 0){
            afTrainingTriggerHelper.shareTrainings(newTrainingsToShare);
        }
    }
}