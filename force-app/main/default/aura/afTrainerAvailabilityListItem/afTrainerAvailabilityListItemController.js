({
    doInit : function(component, event, helper) {

        //why did they put this here. Why do we even need the trainer id to do this init.
        var trainerId = component.get('v.trainerId');

        var availability = component.get('v.availability');
        if(availability==="Available"){
            component.set('v.isAvailable', true);
        } else{
            component.set('v.isAvailable', false);
        }
        var skill = component.get('v.hasSkill');
        if(skill === true){
            component.set("v.isSkill", true);
        } else {
            component.set("v.isSkill", false);
        }
        
    },
    selectIsClicked : function(component, event, helper){
        var trainerId = component.get('v.trainerId');
        console.log(trainerId);
        
        if (component.get('v.isAvailable')) {
            var selectedEvt = $A.get('e.c:TrainerSelected');
        	selectedEvt.setParams({'trainerId':trainerId});
        	selectedEvt.fire();
        } else {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                title : 'Notice',
                message: 'The trainer you selected is not available for the time range indicated.',
                duration: 5000,
                type: 'info',
            });
            toastEvent.fire();
        }
    },
})