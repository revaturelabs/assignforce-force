({
    doInit : function(component, event, helper){
        //sets the trainer attribute to the User Id of the current user
        var user = $A.get('$SObjectType.CurrentUser.Id');
        component.set('v.trainer', user);
    },
    clearFields : function(component, event, helper) {
        helper.clear(component, event);
    },
    onSubmit : function(component, event, helper) {
        event.preventDefault();       // stop the form from submitting
        var isTraining = false;
        var batches = component.get('v.Batches');
        var newStart = new Date(component.get('v.StartDate'));
        var newEnd = new Date(component.get('v.endDate'));
        for(var i=0; i<batches.length; i++){
            var prevStart = new Date(batches[i].StartDate__c);
            var prevEnd = new Date(batches[i].EndDate__c);
            if((prevStart <= newStart    && newStart <= prevEnd) || 
               (prevStart <= newEnd  && newEnd <= prevEnd) || 
               (prevStart >= newStart    && newEnd >= prevEnd)) {
                console.log('toast success');
                var toastEvent = $A.get("e.force:showToast");
                
                toastEvent.setParams({
                    title : 'Notice',
                    message: 'You have selected dates that overlaps with a batch you are training during ',
                    messageTemplate: 'You have selected dates that overlap with a batch you are training during Batch Start {0}, Batch End Date {1}!',
                    messageTemplateData: [prevStart.toLocaleDateString('en-US').toString(), prevEnd.toLocaleDateString('en-US').toString()],
                    mode: 'sticky',
                    type: 'error',
                });
                toastEvent.fire();
                console.log('toastEvent fired iteration: ' + i);
                isTraining = true;
                break;
            }
        }
        console.log('isTraining ' + isTraining);
        if(!isTraining){
            
            var fields = event.getParam('fields');
            component.find('newPTOForm').submit(fields);
        }
    },
    
    onSuccess : function(component, event, helper) {
        var payload = event.getParams().response;
        var cmpEvent = component.getEvent('newPendingPTO');
        cmpEvent.setParams({
            'newPTO':payload.id,
            'startDate':component.get('v.startDate')
        });
        cmpEvent.fire();
        helper.clear(component, event);  
    },
    
})