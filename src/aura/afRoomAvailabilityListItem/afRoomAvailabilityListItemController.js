({
    doInit : function(component, event, helper) {
        var getRoom = component.get('v.room');
        
        if(getRoom.AVAvailability__c == 'Yes'){
            component.set("v.isYes", "true");
        }else if(getRoom.AVAvailability__c == 'No'){
            component.set("v.isNo", "true");
        }else{
            component.set("v.isRequest", "true");
        }
    },
    
    selectedRoom : function(component, event, helper){
        var roomSelected = component.getEvent('roomSelected');
        var room = component.get('v.room');
        roomSelected.setParam('room', room);
        roomSelected.fire();
    }
})