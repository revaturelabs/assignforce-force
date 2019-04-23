({
    TrainersPTO : function (component, event, helper){
        component.set('v.empPTORecordset', [
            
            { label: 'Start Date', fieldName: 'startDate', type: 'date', sortable: 'true', initialWidth: '30px' },
            { label: 'End Date', fieldName: 'endDate', type: 'date', sortable: 'true' },
            { label: 'Status', fieldName: 'status', type: 'text', sortable: 'true'  },
            { label: 'Reason', fieldName: 'reason', type: 'text', sortable: 'true'},
            // Changed: (type: 'action') to (type: 'button')
            { type: 'button', typeAttributes: {label: 'Approve', name: 'Approve' }},
            { type: 'button', typeAttributes: {label: 'Reject', name: 'Reject' }}
            
        ]);
        
        component.set('v.empPTORecordsetApproval', [
            
            { label: 'Start Date', fieldName: 'startDate', type: 'date', sortable: 'true', initialWidth: '30px' },
            { label: 'End Date', fieldName: 'endDate', type: 'date', sortable: 'true' },
            { label: 'Status', fieldName: 'status', type: 'text', sortable: 'true'  },
            { label: 'Reason', fieldName: 'reason', type: 'text', sortable: 'true'},
            
        ]);
            
            helper.getData(component, event);
            },
            
            // Handles mass Approve
            handleApproveAll : function (component, event, helper) {
            var rows = component.get('v.empFuturePTODataset');
            // var rowsToApproval = rows.isSelected();
            var rowsApproval = component.get('v.empCurrentPTODataset');
            var arg = [];
            for (var i = 0; i < rows.length; i++){
                arg.push(rows[i].Id);
            }
            
            // do approval things
            var apexAction = component.get("c.approvePTO");
            apexAction.setParams({"ptoIdToApprove":arg});
            apexAction.setCallback(this, function(response){
            if(response.getState() === "SUCCESS") {
                console.log('approved successfully');
                for (var i = 0; i < rows.length; i++){
                    console.log(rows[i].status);
                    rows[i].status = 'Approved';
                    console.log(rows[i].status);
                    // Updates the Currect PTO tab on the trainers section
                    rowsApproval.push(rows[i]);
    			}
    component.set('v.empCurrentPTODataset', rowsApproval);
    // Removes row from the Upcoming PTO tab on the trainers section
    rows = [];
    component.set('v.empFuturePTODataset', rows);
} else {
 console.log(response.getError());
}
});
$A.enqueueAction(apexAction);
},
    
    // Handles mass reject
    handleRejectAll : function (component, event, helper) {
        var rows = component.get('v.empFuturePTODataset');
        // do rejection things
        var arg;
        for (var i = 0; i < rows.length; i++){
            arg.push(rows[i].id);
        }
        var apexAction = component.get("c.rejectPTO");
        apexAction.setParams({"ptoIdToReject":arg});
        apexAction.setCallback(this, function(response){
            if(response.getState() === "SUCCESS") {
                console.log('rejected successfully');
                for (var i = 0; i < rows.length; i++){
                    console.log(rows[i].status);
                    rows[i].status = 'Rejected';
                    console.log(rows[i].status);
                }
                rows = [];
                component.set('v.empFuturePTODataset', rows);
            } else {
                console.log(response.getError());
            }
        });
        
        $A.enqueueAction(apexAction);
        
    },
        
        handleRowAction : function (component, event, helper) {
            var action = event.getParam('action');
            var row = event.getParam('row');
            var rows = component.get('v.empFuturePTODataset');
            var rowsApproval = component.get('v.empCurrentPTODataset');
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
                            // Updates the Currect PTO tab on the trainers section
                            rowsApproval.push(rows[rowIndex]);
                            component.set('v.empCurrentPTODataset', rowsApproval);
                        } else {
                            console.log(response.getError());
                        }
                        // Removes row from the Upcoming PTO tab on the trainers section
                        if(response.getState() === "SUCCESS"){rows.splice(rowIndex, 1);
                                                              component.set('v.empFuturePTODataset', rows);}
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
                            console.log(rows[rowIndex].status);
                            rows[rowIndex].status = 'Rejected';
                            console.log(rows[rowIndex].status);
                            rows.splice(rowIndex, 1);
                            component.set('v.empFuturePTODataset', rows);
                        } else {
                            console.log(response.getError());
                        }
                    });
                    $A.enqueueAction(apexAction);
                    break;
            }
        },
})