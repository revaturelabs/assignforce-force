public class afNewBatchFormApexController {

    //@TODO Add Comments
    @AuraEnabled
    public static List<Training_Room__c> filterRoomByLocation(String location, List<Training_Room__c> rooms ){

        List<Training_Room__c> filteredRooms = new List<Training_Room__c>();

        filteredRooms.add(new Training_Room__c());

        for(Training_Room__c room : rooms){
            if(location == room.TrainingLocationName__c)
                filteredRooms.add(room);
        }
        
        return filteredRooms;
    }
}