({
    /*----------------------------------------------------------
    				Clear Input Section
    ----------------------------------------------------------*/
    clearBatchFields : function(component, event, helper) {
        helper.fullClear(component, event);
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
        // the batch can be created with empty training track and trainer, evaluate what to fill in using conditions.
        if (!component.get("v.track") || !component.get("v.trainer")) {
            if (!component.get("v.track") && !(!component.get("v.trainer"))) {
                // display toast warning user for not completing the Training Track field
                var toastEvent = $A.get("e.force:showToast");
                
                toastEvent.setParams({
                    duration: '2000',
                    title: "Info",
                    messageTemplate: 'Training track was left empty, it has been set to default - {0}.',
                    messageTemplateData: ['Full Stack Java/JEE'],
                    message: "Training track was left empty, it has been set to default - Full Stack Java/JEE.", 
                    type: "info"
                });
                toastEvent.fire();
                
                var newBatch = [{
                    TrainingTrack__c        : "a072E00000W4gsMQAR",
                    StartDate__c            : component.get("v.startDate"),
                    EndDate__c              : component.get("v.endDate"),
                    Trainer__c              : component.get("v.trainer"),
                    CoTrainer__c            : component.get("v.cotrainer"),
                    External_Trainer__c     : component.get("v.ExternalTrainer"),
                    TrainingLocation__c     : component.get("v.location"),
                    TrainingRoom__c         : component.get("v.room"),
                    Status__c               : component.get("v.status"),
                }];
                
                // records have been submitted, clear form
                helper.partialClear(component, event);  
                
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
            } else if (!component.get("v.trainer") && !(!component.get("v.track"))) {
                // display toast warning user for not completing the Trainer field
                var toastEvent = $A.get("e.force:showToast");
                
                toastEvent.setParams({
                    duration: '2000',
                    title: "Info",
                    messageTemplate: 'Trainer was left empty, it has been set to default - {0}.',
                    messageTemplateData: ['External Trainer'],
                    message: "Trainer was left empty, it has been set to default - External Trainer", 
                    type: "info"
                });
                toastEvent.fire();
                
                var newBatch = [{
                    TrainingTrack__c        : component.get("v.track"),
                    StartDate__c            : component.get("v.startDate"),
                    EndDate__c              : component.get("v.endDate"),
                    Trainer__c              : component.get("v.trainer"),
                    CoTrainer__c            : component.get("v.cotrainer"),
                    External_Trainer__c     : "a002E00000ZYObBQAX",
                    TrainingLocation__c     : component.get("v.location"),
                    TrainingRoom__c         : component.get("v.room"),
                    Status__c               : component.get("v.status"),
                }];
                
                // records have been submitted, clear form
                helper.partialClear(component, event);  
                
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
            } else if (!component.get("v.trainer") && !component.get("v.track")) {
                // display toast warning user for not completing the training track and trainer field
                var toastEvent = $A.get("e.force:showToast");
                
                toastEvent.setParams({
                    duration: '2000',
                    title: "Info",
                    messageTemplate: 'Both Training track and trainer was left empty, it has been set to default - {0} and {1}.',
                    messageTemplateData: ['Full Stack Java/JEE','External Trainer'],
                    message: "Both Training track and trainer was left empty, it has been set to default - Full Stack Java/JEE and External Trainer.", 
                    type: "info"
                });
                toastEvent.fire();
                
                var newBatch = [{
                    TrainingTrack__c        : "a072E00000W4gsMQAR",
                    StartDate__c            : component.get("v.startDate"),
                    EndDate__c              : component.get("v.endDate"),
                    Trainer__c              : component.get("v.trainer"),
                    CoTrainer__c            : component.get("v.cotrainer"),
                    External_Trainer__c     : "a002E00000ZYObBQAX",
                    TrainingLocation__c     : component.get("v.location"),
                    TrainingRoom__c         : component.get("v.room"),
                    Status__c               : component.get("v.status"),
                }];
                
                // records have been submitted, clear form
                helper.partialClear(component, event);  
                
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
            }
        }
    },
    
    formSubmit : function (component, event, helper) {
        alert("This is the start of the form Messages");
        var newBatch = [{
            TrainingTrack__c        : component.get("v.track"),
            StartDate__c            : component.get("v.startDate"),
            EndDate__c              : component.get("v.endDate"),
            Trainer__c              : component.get("v.trainer"),
            CoTrainer__c            : component.get("v.cotrainer"),
            External_Trainer__c     : component.get("v.ExternalTrainer"),
            TrainingLocation__c     : component.get("v.location"),
            TrainingRoom__c         : component.get("v.room"),
            Status__c               : component.get("v.status"),
        }];
        
        // records have been submitted, clear form
        helper.partialClear(component, event);  
        
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
    
    changeTrack : function (component, event, helper) {
        var trackChosen = component.get('v.track');
        if (trackChosen == "") {
            trackChosen = null;
        }
        helper.fireNewBatchFormEvent(trackChosen, 
                                     component.get('v.startDate'), 
                                     component.get('v.endDate'), 
                                     component.get('v.location')
                                    );
    },
    
    changeDate : function (component, event, helper) {
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
        helper.partialClear(component, event);
        helper.fireNewBatchFormEvent(component.get('v.track'), 
                                     startBatch, 
                                     endBatch, 
                                     component.get('v.location')
                                    );
    },
    
    changeLocation : function (component, event, helper) {
        var locationChosen = component.get('v.location');
        helper.fireNewBatchFormEvent(component.get('v.track'), 
                                     component.get('v.startDate'), 
                                     component.get('v.endDate'), 
                                     locationChosen
                                    );
    },
    
    
    /*----------------------------------------------------------
    					Trainer Section 
    ----------------------------------------------------------*/
    setTrainerField : function(component, event, helper) {
        
        //Why do they do this?!?! Why did I not delete this? I don't know.
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
    
    setExternalTrainerField: function(component, event, helper){
        var externalTrainer = event.getParam("externalTrainerId");
        component.set("v.ExternalTrainer",externalTrainer);
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
    
    /*----------------------------------------------------------
    					Error Toast Section
    ----------------------------------------------------------*/
    
    onError : function(component, errors) {
        // Configure error toast
        let toastParams = {
            title: "Error",
            message: "Please select a valid date", // Default error message
            type: "error"
        };
        
        /*
        // Pass the error message if any
        if (errors && Array.isArray(errors) && errors.length > 0) {
            toastParams.message = errors[0].message;
        }
        */
        
        // Fire error toast
        let toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams(toastParams);
        toastEvent.fire();
    },
})