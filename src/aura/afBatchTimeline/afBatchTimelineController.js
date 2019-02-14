({
    doInit : function(component, event, helper)
    {
        helper.getNames(component, event);
        console.log('helper names: ' + component.get('v.yAxisNames'));
        var action = component.get("c.getListOfTrainingJSON");
        action.setParams({"trainers" : component.get('v.yAxisNames')});
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