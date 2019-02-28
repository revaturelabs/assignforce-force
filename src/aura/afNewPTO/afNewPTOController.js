({
    doInit : function(component, event, helper){
        var user = $A.get('$SObjectType.CurrentUser.Id');
        component.set('v.trainer', user);
    },
    clearFields : function(component, event, helper) {
        helper.clear(component, event);
    },
    onSubmit : function(component, event, helper) {
        event.preventDefault();       // stop the form from submitting
        var fields = event.getParam('fields');
        component.find('newPTOForm').submit(fields);
        console.log('fields' + JSON.stringify(fields));
    },
    
    onSuccess : function(component, event, helper) {
        console.log('onSuccess');
        var payload = event.getParams().response;
        var cmpEvent = component.getEvent('newPendingPTO');
        cmpEvent.setParams({
            'newPTO':payload.id,
            'startDate':component.get('v.startDate')
        });
        console.log('Are you undefined here? ' + component.get('v.startDate'));
        cmpEvent.fire();
        helper.clear(component, event);  
    },
    
})