({
    doInit : function(component, event, helper) {
        var getSkills = component.get("c.getAllSkills");
        //sets a call back from the server to get an array of all the skills records
        getSkills.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.allSkills', response.getReturnValue());
            } else{
                console.log('Error1');
            }
        });
        $A.enqueueAction(getSkills);
        var getTrainings = component.get("c.getAllTrainings");
        //sets a call back from the server to get an array of all the training records
        getTrainings.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.allTrainings', response.getReturnValue());
            } else{
                console.log('Error2');
            }
        });
        $A.enqueueAction(getTrainings);
        var action = component.get("c.getAllTrainers");
        //sets a call back from the server to get an array of users with the trainer role
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                var trainers = helper.resetHasSkill(response.getReturnValue());
                // console.log('trainers' + trainers);
                component.set('v.trainers', helper.sortTrainers(trainers));
            } else{
                console.log('Error3');
            }
        });
        $A.enqueueAction(action);
        
        var getRooms = component.get("c.getRooms");
        //sets a call back from the server to get an array of all the training room records
        getRooms.setCallback(this, function(response) {
            var state = response.getState();
            
            if(component.isValid && state === 'SUCCESS'){                
                component.set("v.rooms", helper.sortTrainingRoom(response.getReturnValue()));
                component.set("v.currentLocRooms", helper.sortTrainingRoom(response.getReturnValue()));
            }else if(state === 'ERROR'){
                var errors = response.getError();
                
                if(errors){
                    if(errors[0] && errors[0].message){
                        console.log('Error message: ' + errors[0].message);
                    }
                }
            }else{
                console.log('Unknown error');
            }
        });
        $A.enqueueAction(getRooms);
        
    },
    
    dateHasChanged: function(component, event, helper){
        //This method checks the start date and end date of every training within the dates selected from the afBatchFormDateEvent and changes the availability of the trainer accordingly
        var trainers = component.get('v.trainers');
        var trainings = component.get('v.allTrainings');
        var startDate = new Date(event.getParam('startDate'));
        var endDate = new Date(event.getParam('endDate'));
        var currentLocRooms = component.get('v.currentLocRooms');
        for(var i=0; i<trainers.length; i++){
            for (var j = 0; j < trainings.length; j++) {
                if(trainers[i].Id == trainings[j].Trainer__c || trainers[i].Id == trainings[j].CoTrainer__c) {
                    var prevStart = new Date(trainings[j].StartDate__c);
                    //prevStart date is a variable to store the Date value of the training start date
                    var prevEnd = new Date(trainings[j].EndDate__c);
                    //prevEnd date is a variable to store the Date value of the training end date
                    
                    if((prevStart <= startDate    && startDate <= prevEnd) || 
                       (prevStart <= endDate  && endDate <= prevEnd) || 
                       (prevStart >= startDate    && endDate >= prevEnd)){
                        trainers[i].Available__c = "Training";
                        break;
                    }else{
                        trainers[i].Available__c = "Available";
                    }
                }
            }
        }
         for(var i=0; i<currentLocRooms.length; i++){
            for (var j = 0; j < trainings.length; j++) {
                if(currentLocRooms[i].Id == trainings[j].TrainingRoom__c) {
                    var prevStart = new Date(trainings[j].StartDate__c);
                    var prevEnd = new Date(trainings[j].EndDate__c);
                    
                    if((prevStart <= startDate && startDate <= prevEnd) || 
                       (prevStart <= endDate  && endDate <= prevEnd) || 
                       (prevStart >= startDate    && endDate >= prevEnd)){
                        currentLocRooms[i].AVAvailability__c = "No";
                        break;
                    }else {
                        currentLocRooms[i].AVAvailability__c = "Yes";
                    }
                }
            }
        }
        
        component.set('v.currentLocRooms', null);
        component.set('v.currentLocRooms', helper.sortTrainingRoom(currentLocRooms));
        component.set('v.trainers', null);
        component.set('v.trainers', helper.sortTrainers(trainers));
        
    },
    
    handleLoc : function(component, event, helper) {
        var loc = event.getParam("location");
        component.set("v.location", loc);
        var currentLocRooms = [];
        var rooms = component.get("v.rooms");
        
        for(var i = 0; i < rooms.length; i++){
            if(rooms[i].TrainingLocation__c == loc){
                currentLocRooms.push(rooms[i]);
            }        
        }
        if(loc == "" || null){
            component.set("v.currentLocRooms", null);
            component.set("v.currentLocRooms", helper.sortTrainingRoom(rooms));
        } else {
            component.set("v.currentLocRooms", null);
            component.set("v.currentLocRooms", helper.sortTrainingRoom(currentLocRooms));
        } 
    },
    
    roomClick: function(component, helper){
        //when the rooms tab is clicked this method sets tab1Shown to false to switch tabs
        var isTab1Shown = component.get('v.tab1Shown');
        if(isTab1Shown){
            component.set('v.tab1Shown', false);
        }
    },
    
    skillHasChanged: function(component, event, helper){
        //this method handles the event to send the new selected training track to all of the trainers
        var trainers = component.get('v.trainers');
        var trainingTrack = event.getParam('track');
        var skills = component.get('v.allSkills');
        component.set('v.selectedTrainingTrack',trainingTrack);
        trainers = helper.checkHasSkill(trainers, skills, trainingTrack);
        component.set('v.trainers', null);
        component.set('v.trainers', helper.sortTrainers(trainers));
    },
    
    trainerClick: function (component, helper) {
        //when the trainers' tab is clicked this method sets tab1Shown to true to switch tabs
        var isTab1Shown = component.get('v.tab1Shown');
        if(!isTab1Shown){
            component.set('v.tab1Shown', true);
        }
    },
    
    /*trainingTrackCreated: function(component, event, helper){
        var trainings = component.get('v.allTrainings');
        var trainers = component.get('v.trainers');
        var currentLocRooms = component.get('v.currentLocRooms');
        var newTraining = event.getParam('newBatch');
        trainings.push(newTraining);
        component.set('allTrainings', trainings);
        component.set('v.trainers', null);
        component.set('v.trainers', helper.sortTrainers(helper.sortTrainers(trainers)));
        component.set('v.currentLocRooms', null);
        component.set('v.currentLocRooms', currentLocRooms);
        
    },*/
})