({
    doInit : function(component, event, helper) {
        var getRoom = component.get("v.room");
        var allTrainings = component.get("v.allTrainings");

        //Based off of this room's availability, sets the appropriate boolean attribute to true
        //Done so a certain icon will appear for this room in the application
        for(var i=0; i<allTrainings.length;i++){
            if(allTrainings[i].TrainingRoom__c == getRoom.Id){
                if(currentLocRooms[i].Id == trainings[j].TrainingRoom__c) {
                    var prevStart = component.get("v.startDate");
                    var prevEnd = component.get("v.endDate");
                    
                    if(prevStart <= allTrainings[i].StartDate__c){
                        component.set("v.badTime", true);
                    }
                }
            }
        }
        
        var badTime = component.get("v.badTime");
        if(getRoom.AVAvailability__c === 'Yes' && badTime != true){
            component.set("v.isYes", true);
        }else if(getRoom.AVAvailability__c === 'No' || badTime == true){
            component.set("v.isYes", false);
        }else{
            component.set("v.isRequest", true);
        }
    },
    
    //When the select button is clicked, will link the room's Id in this component with the Id parammeter 
    //need for the for the event
    selectedRoom : function(component, event, helper){
        var roomSelected = $A.get("e.c:roomSelected");
        var room = component.get("v.room");
        roomSelected.setParams("room", room);
        roomSelected.fire();
    },
})