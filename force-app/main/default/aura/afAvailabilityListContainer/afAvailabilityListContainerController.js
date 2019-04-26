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

    //This method is used to fill the sub-list used in pagination for the internal trainers to initialy be displayed.
    //Since it is the defualt tab it also determines if button to view the next page should be enabled or disabled.
    initTrainers: function(component, event, helper){
        var trainers = component.get('v.trainers');
        var trainersPerPage = component.get('v.numberOfTrainersToBeDisplayed');
        var offset = component.get('v.currentTrainerPageNumber');
        var trainerSubList = helper.updateTrainersSubList(trainers,offset,trainersPerPage); 
        component.set('v.trainersOnPage', trainerSubList);
        var disableNext = helper.shouldNextBeDisabled(trainers, 0, trainersPerPage);
        component.set('v.nextDisabled', disableNext);
    },

    //This method is used to fill the sub-list used in pagination for the available rooms to initialy be displayed.
    initRooms : function(component, event, helper){
        //INITIALIZE ROOMS WITH ALL ROOMS    
        var allRooms = component.get("v.allRooms");
        var roomsPerPage = component.get("v.numberOfRoomsToBeDisplayed");
        var offset = component.get('v.currentRoomPageNumber');
        var roomsSubList = helper.updateRoomsSubList(allRooms,offset,roomsPerPage);
        component.set('v.roomsOnPage', roomsSubList);
    },
    
    //This method is used to fill the sub-list used in pagination for the external trainers to initialy be displayed.
    initExternalTrainers : function(component, event, helper){
        var trainers = component.get('v.externalTrainers');
        var trainersPerPage = component.get('v.numberOfExternalTrainersToBeDisplayed');
        var offset = component.get('v.currentExternalTrainerPageNumber');
        var trainerSubList = helper.updateExternalTrainersSubList(trainers,offset,trainersPerPage);
        component.set('v.ExternalTrainersOnPage', trainerSubList);
    },

    userInputRecieved: function(component, event, helper){
        //location and dates are used for sorting both trainers and rooms
        var location = event.getParam("selectedLocation");
        var startBatch = event.getParam("startOfBatch");
        var endBatch = event.getParam("endOfBatch");
        var track = event.getParam("chosenTrack");

        /*-----------------------------------------------------------------------------
                                    User Input Sort Trainers
        -----------------------------------------------------------------------------*/
        
        
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
                //The sub-list used for pagination needs to be updated with the new list of rooms that are available at that location
                var roomsOnPage = helper.updateRoomsSubList(component.get('v.rooms'), 0, component.get('v.numberOfRoomsToBeDisplayed'));
                component.set('v.roomsOnPage', roomsOnPage);
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
		
        /*-------------------
            Sort External Trainers
        --------------------*/

        
        var externalTrainerSort = component.get("c.sortExternalTrainersBySelectedCategories");
        externalTrainerSort.setParams({
            startOfBatch : startBatch,
            endOfBatch : endBatch,
            chosenTrack : track,
            selectedLocation : location
        });
        externalTrainerSort.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                // ACTION to take when return is successful
                // Because we are trying to transfer a list of custom apex objects, we serailize into a JSON 
                // in Apex and then parse here.
                component.set('v.externalTrainers', JSON.parse(response.getReturnValue()));
                var externalTrainersOnPage = helper.updateExternalTrainersSubList(component.get('v.externalTrainers'), 0, component.get('v.numberOfExternalTrainersToBeDisplayed'));
                //The sub-list used for pagination needs to be updated with the new list of rooms that are available at that location
                component.set('v.ExternalTrainersOnPage', externalTrainersOnPage);
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
        
        //After the form recieves input from the user, every page of pagination is reset to the first page 
        //since all of the lists will be filter to have relevant choices first.
        component.set('v.previousDisabled', true); //the previous button should be disabled since the user will be viewing the first page
        var list;
        var pageSize;
        //We need to check which tab is open to determine if next and previous should be enabled
        switch(component.get('v.tabShown')){
            case 0: //internal trainers
                list = component.get('v.trainers');
                pageSize = component.get('v.numberOfTrainersToBeDisplayed');
                break;
            case 1: //available rooms
                list = component.get('v.rooms');
                pageSize = component.get('v.numberOfRoomsToBeDisplayed');
                break;
            case 2: //external trainers
                list = component.get('v.externalTrainers');
                pageSize = component.get('v.numberOfExternalTrainersToBeDisplayed');
                break;
            default:
                break;
        }
        var disableNext = helper.shouldNextBeDisabled(list, 0, pageSize);
        component.set('v.nextDisabled', disableNext);
        //set every page to the first page
        component.set('v.currentTrainerPageNumber', 0);
        component.set('v.currentRoomPageNumber', 0);
        component.set('v.currentExternalTrainerPageNumber', 0);
    },
    
    //This method is called when the room tab is clicked
    //The <tabName>Click methods determine if the buttons for pagination should be enabled or disabled and set the tabShown attribute to the appropriate value
    roomClick: function(component, event, helper){
        var isTabShown = component.get('v.tabShown');
        if(isTabShown != 1){ //don't want the below changes to happen if the user clicks on the room tab while it is the current tab
            var offset = component.get("v.currentRoomPageNumber");
            //the way previous sprints set this up rooms is empty until the form recieves input so we 
            //need to determine if we need to use rooms or allRooms to create and update the sub-list.
            var rooms = component.get("v.rooms");
            if(rooms === undefined  || rooms.length == 0){
                rooms = component.get('v.allRooms');
            }
            var pageSize = component.get("v.numberOfRoomsToBeDisplayed");
            var disable = helper.shouldPreviousBeDisabled(offset);
            component.set('v.previousDisabled', disable);
            disable = helper.shouldNextBeDisabled(rooms, offset, pageSize);
            component.set('v.nextDisabled', disable);
            component.set('v.tabShown', 1);
        }
    },
    
    //This method is called when the internal trainer tab is clicked
    trainerClick: function (component, event, helper) {
        var isTabShown = component.get('v.tabShown');
        if(isTabShown != 0){
            var offset = component.get("v.currentTrainerPageNumber");
            var trainers = component.get("v.trainers");
            var pageSize = component.get("v.numberOfTrainersToBeDisplayed");
            var disable = helper.shouldPreviousBeDisabled(offset);
            component.set('v.previousDisabled', disable);
            disable = helper.shouldNextBeDisabled(trainers, offset, pageSize);
            component.set('v.nextDisabled', disable);
            component.set('v.tabShown', 0);
        }
    },
    
    //This method is called when the external trainer tab is clicked
    externalTrainerClick : function(component, event, helper) {
        var isTabShown = component.get('v.tabShown');
        if(isTabShown != 2){
            var offset = component.get("v.currentExternalTrainerPageNumber");
            var trainers = component.get("v.externalTrainers");
            var pageSize = component.get("v.numberOfExternalTrainersToBeDisplayed");
            var disable = helper.shouldPreviousBeDisabled(offset);
            component.set('v.previousDisabled', disable);
            disable = helper.shouldNextBeDisabled(trainers, offset, pageSize);
            component.set('v.nextDisabled', disable);
            component.set('v.tabShown', 2);
        }
    },
    
    //This method hanles moving to the next page for pagination for every tab
    nextPage: function(component, event, helper) {
        var currentPageType = component.get('v.tabShown');
        switch(currentPageType){
            case 0: //This is the internal trainers tab
                var offset = component.get('v.currentTrainerPageNumber');
                var trainersPerPage = component.get('v.numberOfTrainersToBeDisplayed');
                var trainers = component.get('v.trainers'); //master list of trainers
                var trainerSubList = helper.updateTrainersSubList(trainers,offset+1,trainersPerPage); 
                component.set('v.trainersOnPage', trainerSubList);
                //moving to the next page so increment the current page number
                offset++;
                component.set('v.currentTrainerPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(trainers, offset, trainersPerPage);
                component.set('v.nextDisabled', disabled);
                //previous should always be enabled since next was clickable
                component.set('v.previousDisabled', false);
                break;
            case 1://This is the available rooms tab 
                var offset = component.get('v.currentRoomPageNumber');
                var roomsPerPage = component.get('v.numberOfRoomsToBeDisplayed');
                //the way previous sprints set this up rooms is empty until the form recieves input so we 
                //need to determine if we need to use rooms or allRooms to create and update the sub-list.
                var rooms = component.get('v.rooms'); //master list of rooms
                if(rooms === undefined  || rooms.length == 0){
                    rooms = component.get('v.allRooms');
                }
                var roomSubList = helper.updateRoomsSubList(rooms,offset+1,roomsPerPage); 
                component.set('v.roomsOnPage', roomSubList);
                offset++;
                component.set('v.currentRoomPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(rooms, offset, roomsPerPage);
                component.set('v.nextDisabled', disabled);
                component.set('v.previousDisabled', false);
            	break;               
            case 2://This is the external trainers tab
                var offset = component.get('v.currentExternalTrainerPageNumber');
                var externalTrainersPerPage = component.get('v.numberOfExternalTrainersToBeDisplayed');
                var trainers = component.get('v.externalTrainers'); //master list of rooms
                var roomSubList = helper.updateRoomsSubList(trainers,offset+1,externalTrainersPerPage); 
                component.set('v.ExternalTrainersOnPage', roomSubList);
                offset++;
                component.set('v.currentExternalTrainerPageNumber', offset);
                var disabled = helper.shouldNextBeDisabled(trainers, offset, externalTrainersPerPage);
                component.set('v.nextDisabled', disabled);
                component.set('v.previousDisabled', false);
                break;
            default://This shouldn't ever be reached however, future functionality may cuase the tab index to update elsewhere
                console.log('The current tab is set to: ' + currentPageType);
                
                break;
        }
    },
    
    //This method handles moving to the previous page for all the current tabs
    previousPage: function(component, event, helper) {
        var currentPageType = component.get('v.tabShown');
        switch(currentPageType){
            case 0:
                var offset = component.get('v.currentTrainerPageNumber');
                var trainersPerPage = component.get('v.numberOfTrainersToBeDisplayed');
                var trainers = component.get('v.trainers'); //master list of trainers
                var trainerSubList = helper.updateTrainersSubList(trainers,offset-1,trainersPerPage); 
                component.set('v.trainersOnPage', trainerSubList);
                offset--;
                component.set('v.currentTrainerPageNumber', offset);
                var disabled = helper.shouldPreviousBeDisabled(offset);
                component.set('v.nextDisabled', false); //next is always enabled if previous was clicked
                component.set('v.previousDisabled', disabled);
                break;
            case 1:
                var offset = component.get('v.currentRoomPageNumber');
                var roomsPerPage = component.get('v.numberOfRoomsToBeDisplayed');
                //the way previous sprints set this up rooms is empty until the form recieves input so we 
                //need to determine if we need to use rooms or allRooms to create and update the sub-list.
                var rooms = component.get('v.rooms'); //master list of rooms
                if(rooms === undefined  || rooms.length == 0){
                    rooms = component.get('v.allRooms');
                }                var roomSubList = helper.updateRoomsSubList(rooms,offset-1,roomsPerPage); 
                component.set('v.roomsOnPage', roomSubList);
                offset--;
                component.set('v.currentRoomPageNumber', offset);
                var disabled = helper.shouldPreviousBeDisabled(offset);
                component.set('v.nextDisabled', false);
                component.set('v.previousDisabled', disabled);
            	break;            
            case 2:
                var offset = component.get('v.currentExternalTrainerPageNumber');
                var externalTrainersPerPage = component.get('v.numberOfExternalTrainersToBeDisplayed');
                var trainers = component.get('v.externalTrainers'); //master list of rooms
                var roomSubList = helper.updateRoomsSubList(trainers,offset-1,externalTrainersPerPage); 
                component.set('v.ExternalTrainersOnPage', roomSubList);
                offset--;
                component.set('v.currentExternalTrainerPageNumber', offset);
                var disabled = helper.shouldPreviousBeDisabled(offset);
                component.set('v.nextDisabled', false);
                component.set('v.previousDisabled', disabled);
                break;
            default:            
                console.log('The current tab is set to: ' + currentPageType);
                break;
        }
    },
})