({
    doInit : function(component, event, helper)
    {
        helper.getNames(component, event);
    },
    
    createJSON : function(component, event, helper)
    {
        console.log('Start of create JSON');
        console.log('event '+ event);
        console.log('event params ' + event.getParam('yAxisNames'));
        var action = component.get("c.wrapTrainingToJSON");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS'){
                var dataObj = response.getReturnValue();
                console.log('===='+dataObj);
                component.set("v.data",dataObj);
                console.log('here');
                helper.createChart(component, event);
                
                
            }
            else if(state === 'ERROR')
            {
                console.log('Callback has failed!');
            }
        });
        $A.enqueueAction(action);
    },
    
})