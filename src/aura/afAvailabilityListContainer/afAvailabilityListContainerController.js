({
	doInit : function(component, event, helper) {
        console.log('doInit error');
		var action = component.get("c.getAllTrainers");
        console.log('error before call back');
        action.setCallback(this, function(response){
           var state = response.getState();
            console.log('state', state);
            if(component.isValid() && state === "SUCCESS"){
                console.log('response' , response.getReturnValue() );
                component.set('v.trainers', response.getReturnValue() );
                
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(action);
	},
})