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
        
=======

>>>>>>> JohnTsai
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
                // ACTION to take when return is successful
                // Because we are trying to transfer a list of custom apex objects, we serailize into a JSON 
                // in Apex and then parse here.
                component.set('v.externalTrainers', JSON.parse(response.getReturnValue()));
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
        var disableNext = helper.shouldNextBeDisabled(trainers, 0, trainersPerPage);
        //console.log("should next be disabled: " + disableNext);
        component.set('v.nextDisabled', disableNext);
    },

    initRooms : function(component, event, helper){
        //INITIALIZE ROOMS WITH ALL ROOMS    
        var allRooms = component.get("v.allRooms");
        var roomsPerPage = component.get("v.numberOfRoomsToBeDisplayed");
        var offset = component.get('v.currentRoomPageNumber');
        var roomsSubList = helper.updateRoomsSubList(allRooms,offset,roomsPerPage);
        component.set('v.roomsOnPage', roomsSubList);
    },
    
    //This method has not been implemented yet
    initExternalTrainers : function(component, event, helper){
        var trainers = component.get('v.externalTrainers');
        //console.log("list of external trainers: " + trainers);
        var trainersPerPage = component.get('v.numberOfExternalTrainersToBeDisplayed');
        var offset = component.get('v.currentExternalTrainerPageNumber');
        //console.log('got to the start of the helper method');
        var trainerSubList = helper.updateExternalTrainersSubList(trainers,offset,trainersPerPage); 
        //console.log('got through the helper');
        component.set('v.ExternalTrainersOnPage', trainerSubList);
        //console.log("got through the whole thing");
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
    
    roomClick: function(component, event, helper){
        //when the rooms tab is clicked this method sets tab1Shown to false to switch tabs
        var isTabShown = component.get('v.tabShown');
        //console.log("starting room click");
        if(isTabShown != 1){
            var offset = component.get("v.currentRoomPageNumber");
            var rooms = component.get("v.allRooms");
            var pageSize = component.get("v.numberOfRoomsToBeDisplayed");
            //console.log("got all of the attriubtes");
            var disable = helper.shouldPreviousBeDisabled(offset);
           // console.log("got passed the previous helper")
            component.set('v.previousDisabled', disable);
            //console.log("set false");
            disable = helper.shouldNextBeDisabled(rooms, offset, pageSize);
            //console.log("got past the next helper");
            component.set('v.nextDisabled', disable);
            //console.log("set next");
            component.set('v.tabShown', 1);
        }
    },
    
    trainerClick: function (component, event, helper) {
        //when the trainers' tab is clicked this method sets tabShown to switch tabs
        var isTabShown = component.get('v.tabShown');
        //console.log("starting trainer click");
        if(isTabShown != 0){
            var offset = component.get("v.currentTrainerPageNumber");
            var trainers = component.get("v.trainers");
            var pageSize = component.get("v.numberOfTrainersToBeDisplayed");
            //console.log("got all of the attriubtes");
            var disable = helper.shouldPreviousBeDisabled(offset);
            component.set('v.previousDisabled', disable);
            //console.log("set false");
            disable = helper.shouldNextBeDisabled(trainers, offset, pageSize);
            //console.log("got past the helper");
            component.set('v.nextDisabled', disable);
            //console.log("set next");
            component.set('v.tabShown', 0);
        }
    },
    
    externalTrainerClick : function(component, event, helper) {
        var isTabShown = component.get('v.tabShown');
        if(isTabShown != 2){
            var offset = component.get("v.currentExternalTrainerPageNumber");
            var trainers = component.get("v.externalTrainers");
            var pageSize = component.get("v.numberOfExternalTrainersToBeDisplayed");
            //console.log("got all of the attriubtes");
            var disable = helper.shouldPreviousBeDisabled(offset);
            component.set('v.previousDisabled', disable);
            //console.log("set false");
            disable = helper.shouldNextBeDisabled(trainers, offset, pageSize);
            //console.log("got past the helper");
            component.set('v.nextDisabled', disable);
            //console.log("set next");
            component.set('v.tabShown', 2);
        }
    },
    
    nextPage: function(component, event, helper) {
        //console.log("next page starting");
        var currentPageType = component.get('v.tabShown');
        switch(currentPageType){
            case 0: //This is the internal trainers tab
               //console.log("page is currently internal trainers");
                var offset = component.get('v.currentTrainerPageNumber');
                var trainersPerPage = component.get('v.numberOfTrainersToBeDisplayed');
                var trainers = component.get('v.trainers'); //master list of trainers
                var trainerSubList = helper.updateTrainersSubList(trainers,offset+1,trainersPerPage); 
                component.set('v.trainersOnPage', trainerSubList);
                offset++;
                component.set('v.currentTrainerPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(trainers, offset, trainersPerPage);
                //console.log("disabled: " + disabled);
                component.set('v.nextDisabled', disabled);
                component.set('v.previousDisabled', false);
                break;
            case 1://This is the available rooms tab 
            	//console.log("page is currently rooms");
                var offset = component.get('v.currentRoomPageNumber');
                var roomsPerPage = component.get('v.numberOfRoomsToBeDisplayed');
                var rooms = component.get('v.allRooms'); //master list of rooms
                var roomSubList = helper.updateRoomsSubList(rooms,offset+1,roomsPerPage); 
                component.set('v.roomsOnPage', roomSubList);
                offset++;
                component.set('v.currentRoomPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(rooms, offset, roomsPerPage);
                //console.log("disabled: " + disabled);
                component.set('v.nextDisabled', disabled);
                component.set('v.previousDisabled', false);
            	break;               
            case 2://This is the external trainers tab
                console.log("page is currently external trainers");
                var offset = component.get('v.currentExternalTrainerPageNumber');
                var externalTrainersPerPage = component.get('v.numberOfExternalTrainersToBeDisplayed');
                var trainers = component.get('v.externalTrainers'); //master list of rooms
                var roomSubList = helper.updateRoomsSubList(trainers,offset+1,externalTrainersPerPage); 
                component.set('v.ExternalTrainersOnPage', roomSubList);
                offset++;
                component.set('v.currentExternalTrainerPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(trainers, offset, externalTrainersPerPage);
                //console.log("disabled: " + disabled);
                component.set('v.nextDisabled', disabled);
                component.set('v.previousDisabled', false);
                break;
            default://This shouldn't ever be reached however, we will throw errors in case it happens
                
                break;
        }
        //console.log("next page finished");

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
                //console.log("offset is: " + offset);
                //var disabled = 1 > offset; //change this back to the helper method
                var disabled = helper.shouldPreviousBeDisabled(offset);
                //console.log("disabled: " + disabled);
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
                //var disabled = 1 > offset; //change this back to the helper method
                var disabled = helper.shouldPreviousBeDisabled(offset);
                //console.log("disabled: " + disabled);
                component.set('v.nextDisabled', false);
                component.set('v.previousDisabled', disabled);
            	break;            
            case 2:
				console.log("page is currently external trainers");
                var offset = component.get('v.currentExternalTrainerPageNumber');
                var externalTrainersPerPage = component.get('v.numberOfExternalTrainersToBeDisplayed');
                var trainers = component.get('v.externalTrainers'); //master list of rooms
                var roomSubList = helper.updateRoomsSubList(trainers,offset-1,externalTrainersPerPage); 
                component.set('v.ExternalTrainersOnPage', roomSubList);
                offset--;
                component.set('v.currentExternalTrainerPageNumber', offset);
                var disabled = helper.shouldPreviousBeDisabled(trainers, offset, externalTrainersPerPage);
                //console.log("disabled: " + disabled);
                component.set('v.nextDisabled', false);
                component.set('v.previousDisabled', disabled);
                break;
            default:            
                break;
        }
        //console.log("previous page finsihed");
    },
})
