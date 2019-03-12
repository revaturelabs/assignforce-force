({
    doInit : function(component, event, helper) {
        var userId = $A.get("$SObjectType.CurrentUser.Id"); 
        component.set("v.userId", userId);

        var file = component.get("c.getFile");
        file.setParams({ "userId" : userId });
        
        file.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.filename', response.getReturnValue().Title);
                component.set('v.fileId', response.getReturnValue().Id);
            } else{
                console.log('No File to Display');
            }
        });
        $A.enqueueAction(file); 
    },
    
    handleFiles : function (component, event, helper) {
        var userId = component.get("v.userId");
        
        var handleFile = component.get("c.getFile");
        handleFile.setParams({ "userId" : userId});
        
        handleFile.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.filename', response.getReturnValue().Title);
                component.set('v.fileId', response.getReturnValue().Id);
            } else{
                console.log('No File to Display');
            }
        });
        $A.enqueueAction(handleFile);
        
        component.set("v.hasChanged", true);
    },
    
    onSubmit : function(component, event, helper) {
        event.preventDefault();
        var fields = event.getParam('fields');
        component.find('currentUserInfo').submit(fields);
    },
    
    onSuccess : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            title : 'SUCCESS!',
            message: 'Modifications have been saved.',
            type: 'success'
        });
        toastEvent.fire();
    },
    
    isRefreshed: function(component, event, helper) {
        location.reload();
    },
})