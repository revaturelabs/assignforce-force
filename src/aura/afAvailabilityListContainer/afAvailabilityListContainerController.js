({
    doInit : function(component, event, helper) {
        var getSkills = component.get("c.getAllSkills");
        getSkills.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.allSkills', response.getReturnValue());
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(getSkills);
        
        var getTrainings = component.get("c.getAllTrainings");
        getTrainings.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.allTrainings', response.getReturnValue());
                var t = component.get('v.allTrainings');
                console.log("Training: " + t);
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(getTrainings);
        
        var action = component.get("c.getAllTrainers");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.trainers', helper.sortTrainers(helper.sortTrainers(response.getReturnValue())));
                component.set('v.masterTrainers', helper.sortTrainers(helper.sortTrainers(response.getReturnValue())));
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(action);
        
        var getRooms = component.get("c.getRooms");
        getRooms.setCallback(this, function(response) {
            var state = response.getState();
            
            if(component.isValid && state === 'SUCCESS'){
                component.set("v.rooms", response.getReturnValue());
                component.set("v.currentLocRooms", response.getReturnValue());
            }else if(state === 'ERROR'){
                var errors = response.getError();
                
                console.log('Error message: ' + errors[0].message);
            }else{
                console.log('Unknown error');
            }
        });
        $A.enqueueAction(getRooms);
    },
    trainerClick: function (component, helper) {
        var isTab1Shown = component.get('v.tab1Shown');
        if(!isTab1Shown){
            component.set('v.tab1Shown', true);
        }
    },
    roomClick: function(component, helper){
        var isTab1Shown = component.get('v.tab1Shown');
        if(isTab1Shown){
            component.set('v.tab1Shown', false);
        }
    },
    handleLoc : function(component, event, helper) {
        var loc = event.getParam("location");
        component.set("v.location", loc);
        
        var currentLocRooms = [];
        var roomsNotAtLoc = [];
        
        var rooms = component.get("v.rooms");
        
        for(var i = 0; i < rooms.length; i++){
            if(rooms[i].TrainingLocation__c == loc){
                currentLocRooms.push(rooms[i]);
            } else {
                roomsNotAtLoc.push(rooms[i]);
            }
        }
        if(loc == ""){
            component.set("v.currentLocRooms", null);
            component.set("v.currentLocRooms", rooms);
        } else {
            component.set("v.currentLocRooms", null);
            component.set("v.currentLocRooms", currentLocRooms);
        }
    },
    
    dateHasChanged: function(component, event, helper){
        var trainers = component.get('v.trainers');
        var trainings = component.get('v.allTrainings');
        var startDate = new Date(event.getParam('startDate'));
        var endDate = new Date(event.getParam('endDate'));
        var currentLocRooms = component.get('v.currentLocRooms');
        
        for(var i=0; i<trainers.length; i++){
            for (var j = 0; j < trainings.length; j++) {
                if(trainers[i].Id == trainings[j].Trainer__c || trainers[i].Id == trainings[j].CoTrainer__c) {
                    var prevStart = new Date(trainings[j].StartDate__c);
                    var prevEnd = new Date(trainings[j].EndDate__c);
                    
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
        component.set('v.startDate', startDate);
        component.set('v.endDate', endDate);
        
        component.set('v.currentLocRooms', null);
        component.set('v.currentLocRooms', currentLocRooms);
        component.set('v.trainers', null);
        component.set('v.trainers', helper.sortTrainers(helper.sortTrainers(trainers)));
        
    },
    
    handleDate : function(component, event, helper){
        var start = event.getParam("startDate");
        var end = event.getParam("endDate");
    }
})