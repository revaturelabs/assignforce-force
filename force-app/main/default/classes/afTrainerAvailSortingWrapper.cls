public class afTrainerAvailSortingWrapper implements Comparable{
    public boolean hasSkill{get; set;}
    public boolean available {get;set;}
    public boolean atLocation {get;set;}
    public String location {get; set;}
    public External_Trainer__c trainer {get; set;}
    public String trainerFirstName {get;set;}
    public String trainerLastName {get;set;}
    
    public afTrainerAvailSortingWrapper(boolean hasSkill, boolean available, boolean atLocation, External_Trainer__c trainer){
        this.hasSkill = hasSkill;
        this.available = available;
        this.atLocation = atLocation;
        this.trainer = trainer;
<<<<<<< HEAD
=======
        this.trainerId = trainer.Id;
        this.trainerFirstName = trainer.First_Name__c;
        this.trainerLastName = trainer.Last_Name__c;
        system.debug(trainerFirstName);
>>>>>>> HarryCrane
    }
    
    //Will be sorting ascending, so negative output means this comes before other (this < other)
    public Integer compareTo(Object obj){
        if(obj == null || !(obj instanceof afTrainerAvailSortingWrapper)){
            return -1;
        }
        afTrainerAvailSortingWrapper other = (afTrainerAvailSortingWrapper) obj; 
        //Null/simple checks
        if(this.trainer === other.trainer){
            return 0;
        }
        if(this.trainer == null){
            return 1;
        }
        if(other.trainer == null){
            return -1;
        }
        
        if(this.available != other.available){
            if(this.available){
                //This is available, other is not, should come first
                return -1;
            } 
            else{
                return 1;
            }
        }
        
        if(this.hasSkill != other.hasSkill){
            if (this.hasSkill){
                return -1;
            }
            else{
                return 1;
            }
        }
        
        if(this.atLocation != other.atLocation){
            if (this.atLocation){
                return -1;
            }
            else{
                return 1;
            }
        }
        
        Integer lastNameCompare = this.trainer.Last_Name__c.compareTo(other.trainer.Last_Name__c);
	
        if(lastNameCompare != 0){
            return lastNameCompare;
        }
        
        Integer firstNameCompare = this.trainer.First_Name__c.compareTo(other.trainer.First_Name__c);
	
        if(firstNameCompare != 0){
            return firstNameCompare;
        }
        else{
            return 0;
        }
        
    }
    
}