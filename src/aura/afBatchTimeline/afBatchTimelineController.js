({
    doInit : function(component, event, helper)
    {
        //starts by getting the names for the chart
        helper.getNames(component, event);
    },
    
    updateChart : function(component, event, helper)
    {
        //This is what will actually be setting the data for the chart, after the initial filter of 2019 is set
        if (event.getSource().getName() == 'cFilterChartComponent') {
            component.set('v.data', event.getParam('data'));
        }
        var names = component.get('v.trainers');
        helper.createChart(component, event, names);
        
    },
    
    //This is the handling of the createJSON function, happens after the fireEvent is fired, with the trainer names
    createJSON : function(component, event, helper)
    {
        //Using the data, we'll wrap it into a JSON format so the chart can use this.
        var action = component.get("c.wrapTrainingToJSON");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS'){
                //Sets the data after it's been wrapped to the data attribute
                var dataObj = response.getReturnValue();
                component.set("v.data",dataObj);
                var names = null;
                if(event.getSource().getName() == 'cAfNewBatchForm'){
                //This is refreshing the whole page so the chart component gets refreshed,
                //ideally we should only refresh the individual chart component
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