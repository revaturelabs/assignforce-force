({
    doInit : function(component, event, helper)
    {
        helper.getNames(component, event);
    },
    
    updateChart : function(component, event, helper)
    {
        
        if (event.getSource().getName() == 'cFilterChartComponent') {
            component.set('v.data', event.getParam('data'));
        }
        var names = component.get('v.trainers');
        helper.createChart(component, event, names);
        
    },
    
    createJSON : function(component, event, helper)
    {
        var action = component.get("c.wrapTrainingToJSON");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS'){
                var dataObj = response.getReturnValue();
                component.set("v.data",dataObj);
                var names = null;
                if(event.getSource().getName() == 'cAfNewBatchForm'){
                $A.get('e.force:refreshView').fire();
                }
                
                
            }
            else if(state === 'ERROR')
            {
                alert('Callback has failed!');
            }
        });
        $A.enqueueAction(action);
    },
    /*
    refreshChart : function(component, event, helper){
      	component.set("v.resetBoolean",false);
        component.set("v.resetBoolean",true);
        
        component.reInit();
    },*/
    
})