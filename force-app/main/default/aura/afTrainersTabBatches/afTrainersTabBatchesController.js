({
   //Initilizes inital chart values and calls helper function getData to do server call back
   TrainersBatches : function(component, event, helper) {
       component.set('v.empBatchesRecordset', [

           { label: 'Start Date', fieldName: 'startDate', type: 'date', initialWidth: '30px'  },
           { label: 'End Date', fieldName: 'endDate', type: 'date'  },
           { label: 'Status', fieldName: 'status', type: 'text', typeAttribute: {type: 'helpers.randomize', values: ['Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']}},
           { label: 'Track', fieldName: 'track', type: 'text', },

        ]);
        helper.getData(component, event);
    },

    // Works with the component and helper to enable collapsible sections
    sectionOne : function(component, event, helper) {
        helper.helperDisplay(component,event,'hasActiveBatches');
     },
            
     sectionTwo : function(component, event, helper) {
        helper.helperDisplay(component,event,'hasUpcomingBatches');
     }, 
})