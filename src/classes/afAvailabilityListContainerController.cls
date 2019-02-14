public class afAvailabilityListContainerController {
    public static List<User> Trainers = [SELECT Id, Name, Available__c, Training_Skills__c From User OrderByName /*WHERE Available__c!=null*/ /*UserRoleId=trainer role Id*/];
    @AuraEnabled
    public static List<User> getAllTrainers(){
        //Must add a WHERE clause UserRoleId=Trainer Role Id
        List<User> availableList = new List<User>();
        List<User> unavailableList = new List<User>();
        for(User t: Trainers){
            if(t.Available__c=='Available'){
                availableList.add(t);
            }else{
                unavailableList.add(t);
            }
        }
        availableList.addAll(unavailableList);
        system.debug(availableList);
        return availableList;
    }

}