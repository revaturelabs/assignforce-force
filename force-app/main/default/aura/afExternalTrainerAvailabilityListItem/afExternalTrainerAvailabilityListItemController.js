({
    selectIsClicked : function(component, event, helper){
        
        if(!component.get("v.externalTrainerWrapper.available")){
        	var toastMessage = "This trainer is unavailable. Please select another.";
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "An error has occurred.",
                "type": "error",
                "message": "This trainer is unavailable. Please select another."
            });
            toastEvent.fire();
            return;
        }
        
        var selectedEvt = $A.get('e.c:ExternalTrainerSelected');
        	var externalTrainerId = component.get('v.externalTrainerWrapper.trainer.Id');
        	selectedEvt.setParams({'ExternalTrainerId':externalTrainerId});
        	selectedEvt.fire();
    }
})