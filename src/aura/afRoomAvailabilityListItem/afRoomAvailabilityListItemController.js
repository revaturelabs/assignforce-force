({
    doInit : function(component, event, helper) {
        var getRoom = component.get('v.room');
        //Based off of this room's availability, sets the appropriate boolean attribute to true
        //Done so a certain icon will appear for this room in the application
        if(getRoom.AVAvailability__c == 'Yes'){
            component.set("v.isYes", "true");
        }else if(getRoom.AVAvailability__c == 'No'){
            component.set("v.isNo", "true");
        }else{
            component.set("v.isRequest", "true");
        }
    },
    
    //When the select button is clicked, will link the room's Id in this component with the Id parammeter 
    //need for the for the event
    selectedRoom : function(component, event, helper){
        var roomSelected = component.getEvent('roomSelected');
        var room = component.get('v.room');
        roomSelected.setParam('room', room);
        roomSelected.fire();
    }
})