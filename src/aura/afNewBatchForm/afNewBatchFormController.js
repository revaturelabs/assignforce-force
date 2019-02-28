({
    doInit : function(component, event, helper) {
        
        var allRooms = [];
        var action = component.get("c.allRooms");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                allRooms = response.getReturnValue();
                component.set("v.roomList", allRooms);
                
                var openTrainings = [];
                var trngAction = component.get("c.allTrainings");
                trngAction.setCallback(this, function(response) {
                    var state = response.getState();
                    if (state === "SUCCESS") {
                        openTrainings = response.getReturnValue();
                        component.set("v.openTrainings", openTrainings);
                    } else if (state === "ERROR"){
                        var errors = response.getError();
                        if (errors) {
                            if (errors[0] && errors[0].message) {
                                console.log('Error message: ' + errors[0].message);
                            }
                        }
                    } else {
                        console.log('Unknown error.')
                    }
                })
                $A.enqueueAction(trngAction);
                // end of getting all Training__c records
                
            } else if (state === "ERROR"){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message);
                    }
                }
            } else {
                console.log('Unknown error.')
            }
        })
        $A.enqueueAction(action);
    },
    
    dateChanged : function(component, event, helper) {
        
        helper.changeEndDate(component, event, helper);
        
        var trainer   = component.get("v.trainer");
        var cotrainer = component.get("v.cotrainer");
        component.set("v.trainer", trainer);
        component.set("v.cotrainer", cotrainer);
    }, 
    
    clearBatchFields : function(component, event, helper) {
        helper.clear(component, event);
    },
    
    findRooms : function(component, event, helper) {
        var loc      = component.get("v.location");
        var allRooms = component.get("v.roomList");
        var roomsForLocation = [];
        
        // console.log('made it here');
        for (var i = 0; i < allRooms.length; i++) {
            if (allRooms[i].TrainingLocation__c == loc) {
                availRooms.push(allRooms[i]);
            }
        }
        component.set("v.roomsForLocation",roomsForLocation);
        if(roomsForLocation.length > 0) {
            component.set("v.hiddenRoom", roomsForLocation[0].Id);
            // console.log("rFL[0]: " + roomsForLocation[0].Id);
        } else {
            component.set("v.hiddenRoom", "");
        }
        // pass new location and associated rooms to application event
        var locEvent = $A.get("e.c:afNewBatchFormLocationEvent");
        locEvent.setParams({
            "location" : loc,
            "roomsForLocation" : roomsForLocation
        });
        // console.log('locEvent');
        locEvent.fire();
    },
    
    onSubmit : function(component, event, helper) {
        // in-built functionality to handle recordEditForm submission
        // console.log('onSubmit new');
        // var form = component.find("newBatchForm");
        event.preventDefault();       // stop the form from submitting
        var fields = event.getParam('fields');
        
        component.find('newBatchForm').submit(fields);
    },
    
    onSuccess : function(component, event, helper) {
        console.log('onSuccess');
        
        var newBatch = [{
               CoTrainer__c         : component.get("v.cotrainer"),
            EndDate__c             : component.get("v.endDate"),
            Trainer__c             : component.get("v.trainer"),
            TrainingLocation__c : component.get("v.location"),
            TrainingRoom__c     : component.get("v.hiddenRoom"),
            TrainingTrack__c     : component.get("v.track"),
            StartDate__c         : component.get("v.startDate"),
            Status__c             : component.get("v.status")
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
        
        console.log('newBatch JSON ' + JSON.stringify(newBatchEvent.getParam("newBatch")));
        newBatchEvent.fire();
    },
    
    selectRoom : function(component, event, helper) {
        var room    = component.get("v.room");
        var rooms   = component.get("v.roomsForLocation");
        
        for (var i = 0; i < rooms.length; i++) {
            if(rooms[i].Id == room) {
                room = rooms[i];
            }
        }
        // console.log("selectRoom: " + room);
        // console.log("selectRoom Id: " + room.Id);
        // set to hidden inputField for form submission
        component.set("v.hiddenRoom", room.Id);
    },
    
    setRoomField : function(component, event, helper){
        
        var room = event.getParam("room");
        var allRooms = component.get("v.roomList");
        var roomsForLoc = [];
        
        for (var i = 0; i < allRooms.length; i++) {
            if (allRooms[i].TrainingLocation__c == room.TrainingLocation__c) {
                roomsForLoc.push(allRooms[i]);
            }
        }
        // console.log('roomsforLoc: ' + roomsForLoc);		
        component.set("v.location", room.TrainingLocation__c);
        component.set("v.room", ({"Id " : room.Id  , "Name " : room.Name  ,"TrainingLocation__c " : room.TrainingLocation__c}));
        //actually just set it to room.Id
        component.set("v.hiddenRoom", room.Id);
        component.set("v.roomsForLocation", roomsForLoc);
    },
    
    setTrainerField : function(component, event, helper) {
        var trainer = event.getParam("trainerId");
        component.set("v.trainer", trainer);
        
    },
    
    trackChanged : function(component, event, helper) {
        var track = component.get("v.track");
        // console.log('track: ' + track);
        // pass selected training track to application event
        var trackEvent = $A.get("e.c:afNewBatchFormTrackEvent");
        trackEvent.setParams({
            "track" : track
        });
        // console.log('trackChanged');
        trackEvent.fire();  
    },
    
    trainerChanged : function(component, event, helper) {
        var trainings   = component.get("v.openTrainings");
        var trainer     = event.getParam("value");
        var startDate   = component.get("v.startDate");
        var endDate     = component.get("v.endDate");
        console.log('testing');
        console.log('trainer: ' + trainer);
        helper.showTrainerToast(helper, event, trainings, trainer, startDate, endDate);
    }
})