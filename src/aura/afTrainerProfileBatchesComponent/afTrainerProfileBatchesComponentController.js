({
    //Initilizes inital chart values and calls helper function getData to do server call back 
    doInit : function(component, event, helper) {
        component.set('v.empBatchesRecordset', [
            { label: 'Start Date', fieldName: 'startDate', type: 'date', sortable: 'true', editable: 'true', /*typeAttributes: {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}*/},
            { label: 'End Date', fieldName: 'endDate', type: 'date', sortable: 'true', editable: 'true', /*typeAttributes: {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}*/},
            { label: 'Status', fieldName: 'status', type: 'text', sortable: 'true', typeAttribute: {type: 'helpers.randomize', values: ['Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']}},
            { label: 'Training Office', fieldName: 'officeName', type: 'text', sortable: 'true'},
            { label: 'Track', fieldName: 'track', type: 'text', sortable: 'true'}
        ]);   
            helper.getData(component);
            },
})