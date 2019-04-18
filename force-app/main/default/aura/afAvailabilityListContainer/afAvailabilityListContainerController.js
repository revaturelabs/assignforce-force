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
<<<<<<< HEAD
    },

    initRooms : function(component, event, helper){
        //INITIALIZE ROOMS WITH ALL ROOMS
        var roomsToSet = component.get("v.allRooms");
        component.set("v.rooms", roomsToSet);
=======
        
        component.set('v.currentTrainerPageNumber', 0);
        component.set('v.currentExternalTrainerPageNumber', 0);
        component.set('v.currentRoomPageNumber', 0);
    },
    
    initTrainers: function(component, event, helper){
        var trainers = component.get('v.trainers');
        var trainersPerPage = component.get('v.numberOfTrainersToBeDisplayed');
        var offset = component.get('v.currentTrainerPageNumber');
        var trainerSubList = helper.updateTrainersSubList(trainers,offset,trainersPerPage); 
        component.set('v.trainersOnPage', trainerSubList);
        var disableNext = helper.shouldNextBeDisabled(trainers.length, 0, trainersPerPage);
        component.set('v.nextDisabled', disableNext);
    },

    initRooms : function(component, event, helper){
        //INITIALIZE ROOMS WITH ALL ROOMS    
        var allRooms = component.get("v.allRooms");
        var roomsPerPage = component.get("v.numberOfRoomsToBeDisplayed");
        var offset = component.get('v.currentRoomPageNumber');
        var roomsSubList = helper.updateRoomsSubList(allRooms,offset,roomsPerPage);
        component.set('v.roomsOnPage', roomsSubList);
>>>>>>> HarryMitchell
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
    
<<<<<<< HEAD
    roomClick: function(component){
        //when the rooms tab is clicked this method sets tab1Shown to false to switch tabs
        var isTab1Shown = component.get('v.tab1Shown');
        if(isTab1Shown){
            component.set('v.tab1Shown', false);
        }
    },
    
    trainerClick: function (component) {
        //when the trainers' tab is clicked this method sets tab1Shown to true to switch tabs
        var isTab1Shown = component.get('v.tab1Shown');
        if(!isTab1Shown){
            component.set('v.tab1Shown', true);
        }
=======
    roomClick: function(component, event, helper){
        //when the rooms tab is clicked this method sets tab1Shown to false to switch tabs
        var isTabShown = component.get('v.tabShown');
        if(isTabShown != 1){
        	component.set('v.currentRoomPageNumber', 0);
            component.set('v.tabShown', 1);
        }
    },
    
    trainerClick: function (component, event, helper) {
        //when the trainers' tab is clicked this method sets tabShown to switch tabs
        var isTabShown = component.get('v.tabShown');
        if(isTabShown != 0){
            //component.set('v.currentTrainerPageNumber', 0);
            var offset = component.get("v.currentTrainerPageNumber");
            var trainers = component.get("v.trainers");
            //var listSize = trainers.length;
            var pageSize = component.get("v.numberOfTrainersToBeDisplayed");
            //var disabled = helper.shouldNextBeDisabled(rooms, offset, roomsPerPage);
            console.log("got all of the attriubtes");
            var disable = helper.shouldNextBeDisabled(trainers, offSet, pageSize);
            console.log("got past the helper");
            component.set('v.nextDisabled', disable);
            console.log("set next");
            disable = (1 > offset);
            component.set('v.previousDisabled', disable);
            console.log("set disable"); 
            component.set('v.tabShown', 0);
        }
    },
    
    externalTrainerClick : function(component, event, helper) {
        var isTabShown = component.get('v.tabShown');
        if(isTabShown != 2){
            //component.set('v.currentExternalTrainerPageNumber', 0);
            component.set('v.tabShown', 2);
        }
    },
    
    nextPage: function(component, event, helper) {
        console.log("next page starting");
        var currentPageType = component.get('v.tabShown');
        switch(currentPageType){
            case 0: //This is the internal trainers tab
                console.log("page is currently internal trainers");
                var offset = component.get('v.currentTrainerPageNumber');
                var trainersPerPage = component.get('v.numberOfTrainersToBeDisplayed');
                var trainers = component.get('v.trainers'); //master list of trainers
                var trainerSubList = helper.updateTrainersSubList(trainers,offset+1,trainersPerPage); 
                component.set('v.trainersOnPage', trainerSubList);
                offset++;
                component.set('v.currentTrainerPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(trainers, offset, trainersPerPage);
                console.log("disabled: " + disabled);
                component.set('v.nextDisabled', disabled);
                component.set('v.previousDisabled', false);
                break;
            case 1://This is the available rooms tab 
            	console.log("page is currently rooms");
                var offset = component.get('v.currentRoomPageNumber');
                var roomsPerPage = component.get('v.numberOfRoomsToBeDisplayed');
                var rooms = component.get('v.allRooms'); //master list of rooms
                var roomSubList = helper.updateRoomsSubList(rooms,offset+1,roomsPerPage); 
                component.set('v.roomsOnPage', roomSubList);
                offset++;
                component.set('v.currentRoomPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(rooms, offset, roomsPerPage);
                console.log("disabled: " + disabled);
                component.set('v.nextDisabled', disabled);
                component.set('v.previousDisabled', false);
            	break;               
            case 2://This is the external trainers tab
                
                break;
            default://This shouldn't ever be reached however, we will throw errors in case it happens
                
                break;
        }
        console.log("next page finished");
    },
    
    previousPage: function(component, event, helper) {
        //console.log("prev page starting");
        var currentPageType = component.get('v.tabShown');
        switch(currentPageType){
            case 0:
				//console.log("page is currently internal trainers");
                var offset = component.get('v.currentTrainerPageNumber');
                var trainersPerPage = component.get('v.numberOfTrainersToBeDisplayed');
                var trainers = component.get('v.trainers'); //master list of trainers
                var trainerSubList = helper.updateTrainersSubList(trainers,offset-1,trainersPerPage); 
                component.set('v.trainersOnPage', trainerSubList);
                offset--;
                component.set('v.currentTrainerPageNumber', offset);
                console.log("offset is: " + offset);
                var disabled = 1 > offset; //change this back to the helper method
                console.log("disabled: " + disabled);
                component.set('v.nextDisabled', false); //next is always enabled if previous was clicked
                component.set('v.previousDisabled', disabled);
                break;
            case 1:
				//console.log("page is currently rooms");
                var offset = component.get('v.currentRoomPageNumber');
                var roomsPerPage = component.get('v.numberOfRoomsToBeDisplayed');
                var rooms = component.get('v.allRooms'); //master list of rooms
                var roomSubList = helper.updateRoomsSubList(rooms,offset-1,roomsPerPage); 
                component.set('v.roomsOnPage', roomSubList);
                offset--;
                component.set('v.currentRoomPageNumber', offset);
                var disabled = 1 > offset; //change this back to the helper method
                console.log("disabled: " + disabled);
                component.set('v.nextDisabled', false);
                component.set('v.previousDisabled', disabled);
            	break;            
            case 2:

                break;
            default:            
                break;
        }
        console.log("previous page finsihed");
>>>>>>> HarryMitchell
    },
})