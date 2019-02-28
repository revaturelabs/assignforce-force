({
	 doInit: function (cmp, event, helper) {
         
         var actions = helper.getRowActions.bind(this, cmp);
         
         // Fetch or set your data
         var dbLocation = {
             trainingId: "id",
             trainingClass: "TrainingClass__c",
             startDate: "StartDate__c",
             endDate: "EndDate__c",
             status: "Status",
             trainingOffice: "Training_Location__r.OfficeName__c",
             track: "Training_Track__r.ShortName__c",
             trainer: "User__r.Trainer__c",
             coTrainer: "User__r.CoTrainer__c"
             };
         
         cmp.set('v.lstLocations', [
             { label: 'Training ID', fieldName: 'trainingId', type: 'number', editable: 'false'},
             { label: 'Training Class', fieldName: 'trainingClass', type: 'text', editable: 'true'},
             { label: 'Start Date', fieldName: 'startDate', type: 'date', editable: 'true', typeAttributes: {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}},
             { label: 'End Date', fieldName: 'endDate', type: 'date', editable: 'true', typeAttributes: {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}},
             { label: 'Status', fieldName: 'status', type: 'text', editable: 'true', typeAttribute: {type: 'helpers.randomize', values: ['Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']}},
             { label: 'Training Office', fieldName: 'officeName', type: 'text', editable: 'true'},
             { label: 'Track', fieldName: 'Training_Track__r.ShortName__c', type: 'text', editable: 'true'},
             { label: 'Trainer', fieldName: 'User__r.Trainer__c', type: 'text', editable: 'true'},
             { label: 'Co-Trainer', fieldName: 'User__r.Trainer__c', type: 'text', editable: 'true'},
             { label: 'State', fieldName: 'active', type: 'text' },
             { type: 'action', typeAttributes: { rowActions: actions } }
         ]);
         
         helper.fetchData(cmp, dblocation, 10);
     },
 
     handleRowAction: function (cmp, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        switch (action.name) {
            case 'activate':
                helper.activateContact(cmp, row)
                break;
            case 'deactivate':
                helper.deactivateContact(cmp, row)
                break;
        }
    },
    
    // Client-side controller called by the onsort event handler
    updateColumnSorting: function (cmp, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        // assign the latest attribute with the sorted column fieldName and sorted direction
        cmp.set("v.sortedBy", fieldName);
        cmp.set("v.sortedDirection", sortDirection);
        helper.sortData(cmp, fieldName, sortDirection);
    },
    
    // Load data via init handler first
    // then handle programmatic selection
    handleSelect: function (cmp, event, helper) {
        var rows = ['a'];
        cmp.set('v.selectedRows', rows);
    },
        
})