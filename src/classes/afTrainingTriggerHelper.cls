public class afTrainingTriggerHelper {
    
    public static void createSkills(List<Training__c> trainings){
        Boolean trainerHasSkill = false;
        Boolean cotrainerHasSkill = false; 
        List<Skill__c> skillsToCreate = new List<Skill__c>();
        List<Skill__c> allSkills = [SELECT Trainer__c, Training_Track__c FROM Skill__c];
        for(Training__c training: trainings){
            for(Skill__c skill: allSkills){
                if(training.Trainer__c==skill.Trainer__c && training.TrainingTrack__c==skill.Training_Track__c){
                    trainerHasSkill = true;
                } 
                if(training.CoTrainer__c!=null &&training.CoTrainer__c==skill.Trainer__c && training.TrainingTrack__c==skill.Training_Track__c){
                    cotrainerHasSkill = true;
                }
            }
            if(trainerHasSkill!=true){
                Skill__c newSkill = new Skill__c();
                newSkill.Trainer__c = training.Trainer__c;
                newSkill.Training_Track__c = training.TrainingTrack__c;
                skillsToCreate.add(newSkill);
            }
            if(training.CoTrainer__c!=null && cotrainerHasSkill!=true){
                Skill__c newSkill = new Skill__c();
                newSkill.Trainer__c = training.Trainer__c;
                newSkill.Training_Track__c = training.TrainingTrack__c;
                skillsToCreate.add(newSkill);
            }
            trainerHasSkill = false;
            cotrainerHasSkill = false; 
        }
        insert skillsToCreate;
    }
    
}