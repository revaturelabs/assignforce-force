({
    doInit : function(component, event, helper) {
        var avaibility = component.get('v.avaibility');
        var trainerId = component.get('v.trainerId');
        if(avaibility==="Available"){
            component.set('v.isAvailable', true);
        } else{
            component.set('v.isAvailable', false);
        }
        
    },
    selectIsClicked : function(component, event, helper){
        var selectedEvt = $A.get('e.c:TrainerSelected');
        var trainer = component.get('v.trainer');
        selectedEvt.setParams({'trainerId':trainerId});
        selectedEvt.fire();
    },
})