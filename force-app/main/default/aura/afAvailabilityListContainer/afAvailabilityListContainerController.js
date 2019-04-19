({
    doInit: function(component, event, helper){
        //INITIALIZE TRAINERS WITH INITIAL SORT
        var filterController = component.get("c.sortTrainersBySelectedCategories");
        filterController.setParams({
            startOfBatch : null,
            endOfBatch : null,
            chosenTrack : null,
            selectedLocation : null
        });
        filterController.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                //ACTION to take when return is successful
                component.set('v.trainers', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0010}');
            }
        });
        $A.enqueueAction(filterController);
        
        var externalTrainerSort = component.get("c.sortExternalTrainersBySelectedCategories");
        externalTrainerSort.setParams({
            startOfBatch : null,
            endOfBatch : null,
            chosenTrack : null,
            selectedLocation : null
        });
        externalTrainerSort.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                //ACTION to take when return is successful
                component.set('v.externalTrainers', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0010}');
            }
        });
        $A.enqueueAction(externalTrainerSort);
        
        var externalTrainerCols = [
            {label:'Name', fieldName:'trainer.LastName', type:'text'},
            {label:'Avaiable', fieldName:'available', type:'boolean'},
            {label:'Preferred Location', fieldName:'trainer.Preferred_Location__c', type:'text'},
            {label:'Experienced', fieldName:'hasSkill', type:'boolean'}
        ];
        component.set("v.externalTrainerColumns",externalTrainerCols);
    },

    initRooms : function(component, event, helper){
        //INITIALIZE ROOMS WITH ALL ROOMS
        var roomsToSet = component.get("v.allRooms");
        component.set("v.rooms", roomsToSet);
    },

    userInputRecieved: function(component, event){
        //location and dates are used for sorting both trainers and rooms
        var location = event.getParam("selectedLocation");
        var startBatch = event.getParam("startOfBatch");
        var endBatch = event.getParam("endOfBatch");

        /*-----------------------------------------------------------------------------
                                    User Input Sort Trainers
        -----------------------------------------------------------------------------*/

        var track = event.getParam("chosenTrack");
        
        //FOR DEBUGGING EVENT PASSED PARAMETERS
        //console.log("EVENT INFO: " + typeof track + " ; " + startBatch + " ; " + endBatch + " ; " + location);
        
        var filterControllerTrainers = component.get("c.sortTrainersBySelectedCategories");
        filterControllerTrainers.setParams({
            startOfBatch : startBatch,
            endOfBatch : endBatch,
            chosenTrack : track,
            selectedLocation : location
        });
        filterControllerTrainers.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                //ACTION to take when return is successful
                component.set('v.trainers', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0011}');
            }
        });
        $A.enqueueAction(filterControllerTrainers);

        /*-----------------------------------------------------------------------------
                                    User Input Sort Rooms
        -----------------------------------------------------------------------------*/
        var roomsToPass = component.get("v.allRooms");
        
        var filterControllerRoom = component.get("c.sortRoomsBySelectedCategories");
        filterControllerRoom.setParams({
            allRooms : roomsToPass,
            startOfBatch : startBatch,
            endOfBatch : endBatch,
            selectedLocation : location
        });
        filterControllerRoom.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                //ACTION to take when return is successful
                component.set('v.rooms', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0011}');
            }
        });
        $A.enqueueAction(filterControllerRoom);

    },
    
    trainerClick: function (component) {
        //when the trainers' tab is clicked this method sets tabShown to 0 to switch tabs
            component.set('v.tabShown', 0);
    },

    externalTrainerClick: function(component){
        //when the external Trainer tab is clicked this method sets tabShown to 2 to switch tabs
		component.set('v.tabShown', 2);
    },

    roomClick: function(component){
        //when the rooms tab is clicked this method sets tabShown to 1 to switch tabs
        
        component.set('v.tabShown', 1);
        
    }

})