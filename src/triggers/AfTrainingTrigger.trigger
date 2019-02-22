trigger AfTrainingTrigger on Training__c (after update, after insert) {
    
    if(trigger.isAfter && (trigger.isUpdate || trigger.isInsert)){
        List<Training__c> completedTrainings = new List<Training__c>();
        for(Training__c t: trigger.new){
            if(t.Status__c == 'Completed'){
                completedTrainings.add(t);
            }
        }
        afTrainingTriggerHelper.createSkills(completedTrainings);
    }
	
}