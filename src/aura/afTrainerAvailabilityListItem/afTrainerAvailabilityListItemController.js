({
	doInit : function(component, event, helper) {
		var trainer = component.get('v.trainer');                     
        if(trainer.Available__c==="Available"){
            component.set('v.isAvailable', true);
        } else{
            component.set('v.isAvailable', false);
        }
	},
    selectIsClicked : function(component, event, helper){
        var selectedEvt = component.getEvent('TrainerIsSelected');
        var trainerId = component.get('v.trainer').Id;
        selectedEvt.setParam('trainerId', trainerId);
        selectedEvt.fire();
    }
})