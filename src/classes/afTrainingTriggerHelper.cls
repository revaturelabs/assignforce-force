public class afTrainingTriggerHelper {
    
    public static void createSkills(List<Training__c> trainings){
        Boolean trainerHasSkill = false; //Boolean to track whether there is a skill record associated to to the user in the training
        Boolean cotrainerHasSkill = false; //Boolean to track whether there is a skill record associated to to the user in the training 
        List<Skill__c> skillsToCreate = new List<Skill__c>(); //List of new Skill records to create
        List<Skill__c> allSkills = [SELECT Trainer__c, Training_Track__c FROM Skill__c]; //List of all of the existing skills
        for(Training__c training: trainings){
            for(Skill__c skill: allSkills){
                if(training.Trainer__c==skill.Trainer__c && training.TrainingTrack__c==skill.Training_Track__c){ 
                    // checks to see if the trainer ids match and the training track ids match if they do then the trainer has the skill
                    trainerHasSkill = true;
                } 
                if(training.CoTrainer__c!=null &&training.CoTrainer__c==skill.Trainer__c && training.TrainingTrack__c==skill.Training_Track__c){ 
                    //checks to see if the cotrainer ids match and the training track ids match if they do then the cotrainer has the skill
                    cotrainerHasSkill = true;
                }
            }
            if(trainerHasSkill!=true){
                //Creates a new Skill record if the Trainer does not have a skill Associated to that training track
                Skill__c newSkill = new Skill__c();
                newSkill.Trainer__c = training.Trainer__c;
                newSkill.Training_Track__c = training.TrainingTrack__c;
                skillsToCreate.add(newSkill);
            }
            if(training.CoTrainer__c!=null && cotrainerHasSkill!=true){
                //Creates a new Skill record if the Trainer does not have a skill Associated to that training track
                Skill__c newSkill = new Skill__c();
                newSkill.Trainer__c = training.Trainer__c;
                newSkill.Training_Track__c = training.TrainingTrack__c;
                skillsToCreate.add(newSkill);
            }
            // resets the booleans at the end of checking that training
            trainerHasSkill = false; 
            cotrainerHasSkill = false;
        }
        Database.insert(skillsToCreate, false); // inserts the new skills into the data base with partial processing
    }
    
}