({
   TrainersPTO : function (component, event, helper){
       var actions = [
           { label: 'Approve', name: 'Approve'},
           { label: 'Reject', name: 'Reject'}
       ]
       component.set('v.empPTORecordset', [

           { label: 'Start Date', fieldName: 'startDate', type: 'date', sortable: 'true', initialWidth: '30px' },
           { label: 'End Date', fieldName: 'endDate', type: 'date', sortable: 'true' },
           { label: 'Status', fieldName: 'status', type: 'text', sortable: 'true'  },
           { label: 'Reason', fieldName: 'reason', type: 'text', sortable: 'true'},
           { type: 'action', typeAttributes: { rowActions: actions}}

       ]);
       helper.getData(component, event);
   },

   handleRowAction : function (component, event, helper) {
        var action = event.getParam('action');
        var row = event.getParam('row');
        var rows = component.get('v.empFuturePTODataset');
        var rowIndex = rows.indexOf(row);
        var arg = rows[rowIndex].Id;
        console.log(rowIndex);
        console.log(rows[rowIndex]);
        console.log(arg);

        var id = component.get('v.userId');

        switch(action.name) {
            case 'Approve':
                // do approval things
                var apexAction = component.get("c.approvePTO");
                apexAction.setParams({"ptoIdToApprove":arg});
                apexAction.setCallback(this, function(response){
                    if(response.getState() === "SUCCESS") {
                        console.log('approved successfully');
                        console.log(rows[rowIndex].status);
                        rows[rowIndex].status = 'Approved';
                        console.log(rows[rowIndex].status);
                        component.set('v.empFuturePTODataset', rows);
                    } else {
                        console.log(response.getError());
                    }
                });
                $A.enqueueAction(apexAction);
                break;
            case 'Reject':
                // do rejection things
                var apexAction = component.get("c.rejectPTO");
                apexAction.setParams({"ptoIdToReject":arg});
                apexAction.setCallback(this, function(response){
                    if(response.getState() === "SUCCESS") {
                        console.log('rejected successfully');
                        rows.splice(rowIndex, 1);
                        component.set('v.empFuturePTODataset', rows);
                    } else {
                        console.log(response.getError());
                    }
                });
                $A.enqueueAction(apexAction);
                break;
        }
   }
})