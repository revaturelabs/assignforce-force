({
	doInit : function(component, event, helper) {
		console.log('Did you even run?');
        var trainer = component.get('v.trainer');                     
        if(trainer.Available__c==="Available"){
            component.set('v.isAvailable', true);
        } else{
            component.set('v.isAvailable', false);
        }
        console.log('Trainer= ' + trainer);
        console.log('Skills= ' + JSON.stringify(component.get('v.allSkills')));
	},
    selectIsClicked : function(component, event, helper){
        var selectedEvt = component.getEvent('TrainerIsSelected');
        var trainer = component.get('v.trainer');
        selectedEvt.setParam('trainer', trainer);
        selectedEvt.fire();
    }
})