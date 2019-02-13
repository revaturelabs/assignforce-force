public class afAvailbilityListContainerController {
        
    public static List<Training_Room__c> allRooms = [SELECT Id, name, TrainingLocationName__c, AVAvailability__c, RoomCapacity__c
                                              FROM Training_Room__c
                                              ORDER BY name];
    
    @AuraEnabled
    public static List<Training_Room__c> getRooms(){
        List<Training_Room__c> sorted = new List<Training_Room__c>();
        
        for(Training_Room__c room : allRooms){
            if(room.AVAvailability__c == 'Yes'){
                sorted.add(room);
            }
        }
        for(Training_Room__c room : allRooms){
            if(room.AVAvailability__c == 'Upon Request'){
                sorted.add(room);
            }
        }
        for(Training_Room__c room : allRooms){
            if(room.AVAvailability__c == 'No'){
                sorted.add(room);
            }
        }
        return sorted;
    }
}