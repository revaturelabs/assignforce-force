({
    doInit : function(component, event, helper) {
        var userId = $A.get("$SObjectType.CurrentUser.Id"); 
        component.set("v.userId", userId);

        var files = component.get("c.getFiles");
        files.setParams({ "userId" : userId });

        files.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === "SUCCESS"){
                component.set('v.filename', response.getReturnValue().Title);
                component.set('v.fileId', response.getReturnValue().Id);
            } else{
                console.log('Error');
            }
        });
        $A.enqueueAction(files); 
    },
    
    handleFiles : function (component, event, helper) {
        var file = event.getSource().get("v.files").Title;
        console.log(file);
        component.set("v.filename", file);
        location.reload();
    },
    
    onSubmit : function(component, event, helper) {
        var form = component.find("currentUserInfo");
        event.preventDefault();
        var fields = event.getParam('fields');
        component.find('currentUserInfo').submit(fields);
    },
    
    onSuccess : function(component, event, helper) {
        var form = component.find("currentUserInfo");
        var fields = event.getParam('fields');
        
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