({
   //Initilizes inital chart values and calls helper function getData to do server call back
   ExternalTrainersBatches : function(component, event, helper) {
       //Sets record set with given values provided via labels
       component.set('v.empExtBatchesRecordset', [

           { label: 'Start Date', fieldName: 'startDate', type: 'date'  },
           { label: 'End Date', fieldName: 'endDate', type: 'date'  },
           { label: 'Status', fieldName: 'status', type: 'text', typeAttribute: {type: 'helpers.randomize', values: ['Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']}},
           { label: 'Track', fieldName: 'track', type: 'text', },
       ]);
       
           helper.getData(component, event);
           },
           
     // Works with the component and helper to enable collapsible sections
           sectionOne : function(component, event, helper) {
           helper.helperFun(component,event,'externalHasCurrentBatches'); 
           },
           
           sectionTwo : function(component, event, helper) {
           helper.helperFun(component,event,'externalHasUpcomingBatches');
    },
})