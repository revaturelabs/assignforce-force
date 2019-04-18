trigger afCreateNewTrainingTrackTrigger on Training_Track__c (before insert) {
    if(trigger.isBefore && trigger.isInsert)
    {
        afNewTrainingTrackTriggerHelper.generateBatchColor(Trigger.new);
    }
}