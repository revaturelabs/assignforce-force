({
	doInit : function(component, event, helper) {
        var getSkills = component.get("c.getAllSkills");
        getSkills.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.allSkills', response.getReturnValue());
                console.log(response.getReturnValue());
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(getSkills);
        var action = component.get("c.getAllTrainers");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.trainers', response.getReturnValue() );
                
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
    }
})