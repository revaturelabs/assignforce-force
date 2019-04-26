({
    doInit : function(component, event, helper) {
        var getRoom = component.get("v.room");
        
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
    
    //When the select button is clicked, will link the room's Id in this component with the 
    //Id parameter. Also checks for the available rooms. If room is available, displays the 
    //training location and training room; If room is not available, displays a toast (warning) 
    //message and also displays the training location and training room.
    selectedRoom : function(component, event, helper){
        var getRoom = component.get("v.room");
        var roomSelected = $A.get("e.c:roomSelected");
<<<<<<< HEAD
=======
<<<<<<< HEAD
        var room = component.get("v.room");
        var loc = room.TrainingLocation__c;
        roomSelected.setParams({
            'location' : loc,
            'room': room
        });
        roomSelected.fire();
=======

>>>>>>> 022519Salesforce
        	var room = component.get("v.room");
        	var loc = room.TrainingLocation__c;
        	roomSelected.setParams({
            "location" : loc,
            "room": room
            });
        var toastEvent = $A.get("e.force:showToast");
        	toastEvent.setParams({
            "title": "Warning!",
            "message": "Selected room is not available. Consider chosing a different room."
            });
        if(getRoom.AVAvailability__c == 'Yes'){
            roomSelected.fire();	
        }else{
            toastEvent.fire();
        	roomSelected.fire();	
        }         
<<<<<<< HEAD
=======
>>>>>>> 8b10caca2125ba88703715bdc9bcadffb019e981
>>>>>>> 022519Salesforce
    }
})