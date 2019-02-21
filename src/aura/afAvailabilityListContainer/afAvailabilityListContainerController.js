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
                console.log(response.getReturnValue());
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(getTrainings);
        var action = component.get("c.getAllTrainers");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.trainers', helper.sortTrainers(response.getReturnValue()));
                console.log(helper.sortTrainers(response.getReturnValue()));
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(action);
        
        var getRooms = component.get("c.getRooms");
        console.log('rooms ' + getRooms);
        getRooms.setCallback(this, function(response) {
            var state = response.getState();
            
            if(component.isValid && state === 'SUCCESS'){
                console.log('state ' + state);
                component.set("v.rooms", response.getReturnValue());
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
    skillHasChanged: function(component, event, helper){
        var trainers = component.get('v.trainers');
        var trainingTrack = event.getParam('track');
        component.set('v.selectedTrainingTrack',trainingTrack);
        component.set('v.trainers', null);
        component.set('v.trainers', trainers);
    },
    dateHasChanged: function(component, event, helper){
        var trainers = component.get('v.trainers');
        var startDate = event.getParam('startDate');
        var endDate = event.getParam('endDate');
        for(var i=0; i<trainers.length; i++){
            if(newStart!=undefined && newEnd!=undfined){
                for (var j = 0; j < trainings.length; j++) {
                    if(trainers[i].Id == trainings[j].Trainer__c || trainings[j].CoTrainer__c) {
                        var prevStart = new Date(trainings[i].StartDate__c);
                        var prevEnd = new Date(trainings[i].EndDate__c);
                        if((prevStart <= newStart    && newStart <= prevEnd) || 
                           (prevStart <= newEnd  && newEnd <= prevEnd) || 
                           (prevStart >= newStart    && newEnd >= prevEnd)){
                            trainer[i].Available__c = "Training";
                            break;
                        }
                    }
                }
            }
        }
        component.set('v.startDate', startDate);
        component.set('v.endDate', endDate);
        component.set('v.trainers', null);
        component.set('v.trainers', helper.sortTrainers(trainers));
    }
})