({
    doInit : function(component, event, helper) {
        var getRoom = component.get('v.room');
        
        //Based off of this room's availability, sets the appropriate boolean attribute to true
        //Done so a certain icon will appear for this room in the application
        if(getRoom.AVAvailability__c == 'Yes'){
            component.set("v.isYes", "true");
        }else if(getRoom.AVAvailability__c == 'No'){
            component.set("v.isYes", "false");
        }else{
            component.set("v.isRequest", "true");
        }
    },
    
    //When the select button is clicked, will link the room's Id in this component with the Id parameter 
    //needed for the event
    selectedRoom : function(component, event, helper){
        var roomSelected = $A.get("e.c:roomSelected");
        var room = component.get("v.room");
        var loc = room.TrainingLocation__c;
        roomSelected.setParams({
            'location' : loc,
            'room': room
        });
        roomSelected.fire();
    }
})