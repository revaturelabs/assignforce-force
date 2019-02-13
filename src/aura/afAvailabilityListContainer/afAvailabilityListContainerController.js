({
	doInit : function(component, event, helper) {
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
	},
})