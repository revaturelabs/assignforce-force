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
        //var trainings     = component.get("v.openTrainings");
        
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
        var availRooms = [];
        
        for (var i = 0; i < allRooms.length; i++) {
            if (allRooms[i].TrainingLocation__c == loc) {
                availRooms.push(allRooms[i]);
            }
        }
        component.set("v.availRooms", availRooms);
        
        var locEvent = $A.get("e.c:afNewBatchFormLocationEvent");
        locEvent.setParams({
            "location" : loc
        });
        console.log('locEvent');
        locEvent.fire();
    },
    
    onSubmit : function(component, event, helper) {
        var form = component.find("newBatchForm");
        event.preventDefault();       // stop the form from submitting
        var fields = event.getParam('fields');
        component.find('newBatchForm').submit(fields);
    },
    
    onSuccess : function(component, event, helper) {
        //var record = event.getParam("response");
        var form = component.find("newBatchForm");
        var fields = event.getParam('fields');
        console.log('onSuccess');
        helper.clear(component, event);  
    },
    
    selectRoom : function(component, event, helper) {
        var room    = component.get("v.room");
        var rooms   = component.get("v.availRooms");
        
        for (var i = 0; i < rooms.length; i++) {
            if(rooms[i].Id == room) {
                room = rooms[i];
            }
        }
        component.set("v.hiddenRoom", room.Id);
    },
    
    trackChanged : function(component, event, helper) {
        var track = component.get("v.track");
        var trackEvent = $A.get("e.c:afNewBatchFormTrackEvent");
        trackEvent.setParams({
            "track" : track
        });
        console.log('trackChanged');
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