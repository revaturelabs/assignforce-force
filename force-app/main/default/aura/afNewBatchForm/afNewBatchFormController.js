({
    /*----------------------------------------------------------
    				Clear Input Section
    ----------------------------------------------------------*/
    clearBatchFields : function(component, event, helper) {
        helper.clear(component, event);
    },
    
    /*----------------------------------------------------------
    				Create New Batch Section
    ----------------------------------------------------------*/

    //TODO: MAKE SURE THIS FUNCTION FUNCTIONS

    onSubmit : function(component, event, helper) {
        // In-built functionality to handle recordEditForm submission
        event.preventDefault();       // Stop the form from submitting
        var fields = event.getParam('fields');
        
        component.find('newBatchForm').submit(fields);
    },
    
    onSuccess : function(component, event, helper) {
        
        var newBatch = [{
            TrainingTrack__c        : component.get("v.track"),
            StartDate__c            : component.get("v.startDate"),
            EndDate__c              : component.get("v.endDate"),
            Trainer__c              : component.get("v.trainer"),
            CoTrainer__c            : component.get("v.cotrainer"),
            External_Trainer__c     : component.get("v.ExternalTrainer"),
            TrainingLocation__c     : component.get("v.location"),
            TrainingRoom__c         : component.get("v.hiddenRoom"),
            Status__c               : component.get("v.status"),
        }];
        
        // records have been submitted, clear form
        helper.clear(component, event);  
        
        // display toast informing user of successful submission
        var toastEvent = $A.get("e.force:showToast");
        
        toastEvent.setParams({
            title : 'Success!',
            message: 'The new batch has been created.',
            duration: '2000',
            type: 'success',
        });
        toastEvent.fire();
        
        // send new batch to other components
        var newBatchEvent = $A.get("e.c:afNewBatchCreatedEvent");
        
        newBatchEvent.setParams({
            "newBatch" : newBatch
        });
        
        //FOR TESTING:
        //console.log('newBatch JSON ' + JSON.stringify(newBatchEvent.getParam("newBatch")));

        newBatchEvent.fire();
    },

    /*----------------------------------------------------------
    				Handle User Input Change
    ----------------------------------------------------------*/
    updateAvailabilityOnChange : function (component, event, helper) {

        /*-------------------------------------------
               DETECT USER INPUT: TRACK CHANGED
        -------------------------------------------*/
        var trackChosen = component.get('v.track');
        if( trackChosen == ""){
            trackChosen = null;
        }
        /*-------------------------------------------
               DETECT USER INPUT: DATE CHANGED
        -------------------------------------------*/
        var startBatch = component.get('v.startDate');
        var endBatch = null;
        component.set("v.endDate", endBatch);

        if(startBatch != null){
            helper.changeEndDate(component, event);
            endBatch = component.get('v.endDate');
            if(endBatch == null){
                startBatch = null;
            }
        }
        else {
            startBatch = null;
            endBatch = null;
        }

        //Check if trainer is busy during dates selected
        var trainings   = component.get("v.openTrainings");
        var trainer     = component.get("v.trainer");
        var startDate   = component.get("v.startDate");
        var endDate     = component.get("v.endDate");
        helper.showTrainerToast(helper, event, trainings, trainer, startDate, endDate);

        /*-------------------------------------------
             DETECT USER INPUT: LOCATION CHANGED
        -------------------------------------------*/
        var locationChosen = component.get('v.location');

        /*-------------------------------------------
          DETECT USER INPUT: SEND TO OTHER COMPONENT
        -------------------------------------------*/
        var filterEvent = $A.get("e.c:afNewBatchFormEvent");
        filterEvent.setParams({
            chosenTrack : trackChosen,
            startOfBatch : startBatch,
            endOfBatch : endBatch,
            selectedLocation : locationChosen
        });
        filterEvent.fire();
    },
    
    /*----------------------------------------------------------
    					Trainer Section 
    ----------------------------------------------------------*/
    setTrainerField : function(component, event, helper) {
        
        component.set("v.trainerUncleared", false);
        component.set("v.trainerUncleared", true);
        
        var trainer = event.getParam("trainerId");
        component.set("v.trainer", trainer);
        
        var trainings = component.get("v.openTrainings");
        var startDate = component.get("v.startDate");
        var endDate	  = component.get("v.endDate");
        
        helper.showTrainerToast(helper, event, trainings, trainer, startDate, endDate);
        
    },
    
    trainerChanged : function(component, event, helper) {
        var trainings   = component.get("v.openTrainings");
        var trainer     = component.get("v.trainer");
        var startDate   = component.get("v.startDate");
        var endDate     = component.get("v.endDate");
        
        // pass appropriate values to helper function for display of toast
        helper.showTrainerToast(helper, event, trainings, trainer, startDate, endDate);
    },
    
    /*----------------------------------------------------------
    					Location Section
    ----------------------------------------------------------*/
    setRoomField : function(component, event, helper){
        
        /*Updated implementation of previous itreation - basically the same
        implementation as before but works with server side logic
        This logic can most likely be updated. */

        var room = event.getParam("room");
        var location = event.getParam("location");
        var rooms   = component.get("v.allRooms");       
        var roomsForLoc = [];
        roomsForLoc.push("");

        component.set("v.locUncleared", false);
        component.set("v.locUncleared", true);

        for (var i = 0; i < rooms.length; i++) {
            if(rooms[i].TrainingLocation__c == location){
                roomsForLoc.push(rooms[i]);
            }
        }

        component.set('v.roomsForLocation', roomsForLoc);
        component.set("v.location", room.TrainingLocationName__c);
        component.set("v.hiddenRoom", room.Id);
        component.set("v.room", room.Id);
    },
    
    selectRoom : function(component) {
        var room    = component.get("v.room");
        var rooms   = component.get("v.roomsForLocation");
        
        for (var i = 0; i < rooms.length; i++) {
            if(rooms[i].Id == room) {
                room = rooms[i];
            }
        }
        // set to hidden inputField for form submission
        component.set("v.hiddenRoom", room.Id);
    },
    
    locationChanged : function(component, event, helper) {
        
        component.set("v.locUncleared", false);
        component.set("v.locUncleared", true);
        
        var loc 	= component.get("v.location");
        var roomsList = component.get("v.allRooms");

        console.log(loc);
        
        if(loc == '' || loc == null){
            component.set('v.room', null);
        }

		var filteredRooms = component.get("c.filterRoomByLocation");        
        filteredRooms.setParams({
			location : loc,
            rooms : roomsList,			            
        });
        filteredRooms.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                //ACTION to take when return is successful
                component.set('v.roomsForLocation', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0002}');
            }
        });
        $A.enqueueAction(filteredRooms);
    },
})