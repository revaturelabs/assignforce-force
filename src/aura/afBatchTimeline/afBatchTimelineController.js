({
    doInit : function(component, event, helper)
    {
		var action = component.get("c.getListOfTrainingJSON");
        action.setCallback(this, function(response){
        var state = response.getState();
            if(component.isValid() && state === 'SUCCESS'){
                var dataObj = response.getReturnValue();
                console.log('===='+dataObj);
                component.set("v.data",dataObj);
                                                           console.log('here');
                helper.helperMethod(component, event, helper);
                                                           
            }
            else if(state === 'ERROR')
            {
                console.log('Callback has failed!');
            }
        });
        $A.enqueueAction(action);
    },
})