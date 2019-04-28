public class afNewBatchFormApexController {
    
    @AuraEnabled 
    public static User getExternalTrainerUser(){
        return [SELECT Id FROM User WHERE Name='External Trainer' LIMIT 1];
    }
    
    @AuraEnabled
	public static List<Training_Room__c> filterRoomByLocation(String location, Double capacity, List<Training_Room__c> allRooms ){
		// New list that will store filtered rooms 
        List<Training_Room__c> filteredRooms = new List<Training_Room__c>();

        if(location != '' || location != null){
            for(Training_Room__c room : allRooms){
                // If the location are in the input add to list  
                if(location == room.TrainingLocationName__c && capacity <= room.RoomCapacity__c)
                    filteredRooms.add(room);
            }
            return filteredRooms;
        }
        
        
        return allRooms;
    }
}