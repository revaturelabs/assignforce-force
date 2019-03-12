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
                newSkill.Trainer__c = training.CoTrainer__c;
                newSkill.Training_Track__c = training.TrainingTrack__c;
                skillsToCreate.add(newSkill);
            }
            // resets the booleans at the end of checking that training
            trainerHasSkill = false; 
            cotrainerHasSkill = false;
        }
        Database.insert(skillsToCreate, false); // inserts the new skills into the data base with partial processing
    }
    
    public static void shareTrainings(List<Training__c> trainings){
        List<Id> trainingIds = new List<Id>();
        List<Id> trainerIds = new List<Id>();
        
        for(Training__c t : trainings){
            if(t.Id != null && t.Trainer__c != null){
             	trainingIds.add(t.Id);
                trainerIds.add(t.Trainer__c);
                if(t.CoTrainer__c != null){
                    trainerIds.add(t.CoTrainer__c);
                    trainingIds.add(t.Id);
                }
            }
        }
        
        executeSharing(trainerIds, trainingIds);
    }
    
    public static void executeSharing(List<Id> trainerIds, List<Id> trainingIds){
        List<Training__Share> trainingSharesToInsert = new List<Training__Share>();
        for(Integer i = 0 ; i < trainerIds.size() ; i++){
            Training__Share trainingShare = new Training__Share();
            trainingShare.ParentId = trainingIds[i];
            trainingShare.UserOrGroupId = trainerIds[i];
            trainingShare.AccessLevel = 'Read';
            trainingShare.RowCause = Schema.Training__Share.RowCause.Rule__c;
            trainingSharesToInsert.add(trainingShare);
        }
         System.debug('List function trainingSharesToInsert: ' + trainingSharesToInsert);
        List<Database.SaveResult> listSr = Database.insert(trainingSharesToInsert,false);
        
        for(Database.SaveResult sr : listSr){
            if(sr.isSuccess()){
                System.debug('Successful insert.');
            } else {
                Database.Error err = sr.getErrors()[0];
         if(err.getStatusCode() == StatusCode.FIELD_FILTER_VALIDATION_EXCEPTION  && 
                  err.getMessage().contains('AccessLevel')){
            // Indicates success.
            System.debug('Success!');
         }
         else{
            // Indicates failure.
            System.debug('Failure.');
         }

            }
        }
        
    }
}