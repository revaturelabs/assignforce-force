({
    doInit: function (cmp, event, helper) {
        
        // Fetch or set your data
        
        
        //var actions = helper.getRowActions.bind(this, cmp);
        
        cmp.set('v.batchesColumns', [
            { label: 'Training ID', fieldName: 'Name', type: 'text', editable: 'false'},
            { label: 'Training Class', fieldName: 'TrainingClass__c', type: 'text', sortable: 'true', editable: 'true'},
            { label: 'Start Date', fieldName: 'StartDate__c', type: 'date', sortable: 'true', editable: 'true', /*typeAttributes: {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}*/},
            { label: 'End Date', fieldName: 'EndDate__c', type: 'date', sortable: 'true', editable: 'true', /*typeAttributes: {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'}*/},
            { label: 'Status', fieldName: 'Status__c', type: 'text', sortable: 'true', editable: 'true', typeAttribute: {type: 'helpers.randomize', values: ['Planned', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']}},
            { label: 'Training Office', fieldName: 'officeName', type: 'text', sortable: 'true', editable: 'true'},
            { label: 'Track', fieldName: 'track', type: 'text', sortable: 'true', editable: 'true'},
            { label: 'Trainer', fieldName: 'trainer', type: 'text', sortable: 'true', editable: 'true'},
            { label: 'Co-Trainer', fieldName: 'coTrainer', type: 'text', sortable: 'true', editable: 'true'},
            /*{ label: 'State', fieldName: 'active', type: 'text' },
            /*{ type: 'action', typeAttributes: { rowActions: actions } }*/
        ]);
            
            
            helper.getData(cmp);
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
            var rows = event.getParam('selectedRows');
            cmp.set('v.selectedRows', rows);
            },
            /*getDataFromForm: function (cmp, event, helper) {        
            helper.getData(cmp); 
            },*/
            
            deleteBatches : function (cmp, event, helper) {
            	helper.deleteBatchesHelper(cmp);
            },
            
            handleSave : function (cmp, event, helper) {
            	console.log('Im saving');
            	helper.saveDataTable(cmp);
            },
            
})