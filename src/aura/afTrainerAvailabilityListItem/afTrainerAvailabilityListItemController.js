({
    doInit : function(component, event, helper) {
        //Initialization function that sets the boolean isAvailable to display an icon visually representing whether the trainer is available or not
        var availability = component.get('v.availability');
        if(availability==="Available"){
            component.set('v.isAvailable', true);
        } else{
            component.set('v.isAvailable', false);
        }
        
    },
    selectIsClicked : function(component, event, helper){
        //This method fires the trainer Id in an application event
        var selectedEvt = $A.get('e.c:TrainerSelected');
        var trainerId = component.get('v.trainerId');
        console.log(trainerId);
        selectedEvt.setParams({'trainerId':trainerId});
        selectedEvt.fire();
    },
})