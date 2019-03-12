({
    doInit : function(component, event, helper){
        var getPTOS = component.get("c.getAllPTOs");
        var user = $A.get("$SObjectType.CurrentUser.Id");
        getPTOS.setParams({'user' : user});
        getPTOS.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid && state==='SUCCESS'){
                var PTOs = response.getReturnValue();
                var pendingPTOs = [];
                var approvedPTOs = [];
                var oldApprovedPTOs = [];
                for(var i=0; i<PTOs.length; i++){
                    if(PTOs[i].Status__c ==="Approved" && new Date(PTOs[i].StartDate__c)>=Date.now()){
                        approvedPTOs.push(PTOs[i]);
                    }
                    else if(PTOs[i].Status__c ==="Pending Approval" && new Date(PTOs[i].StartDate__c)>=Date.now()){
                        pendingPTOs.push(PTOs[i]);
                    }
                        else if(PTOs[i].Status__c ==="Approved" && new Date(PTOs[i].StartDate__c)<Date.now()){
                            oldApprovedPTOs.push(PTOs[i]);
                        }
                }
                component.set('v.approvedPTOs', approvedPTOs);
                component.set('v.pendingPTOs', pendingPTOs);
                component.set('v.newApprovedPTOs', approvedPTOs);
                component.set('v.oldApprovedPTOs', oldApprovedPTOs);
            } else if(state==='ERROR'){
                console.log('Server error occured');
            } else{
                console.log('Unknown Error has occured');
            }
        });
        var getBatches = component.get('c.getBatches');
        getBatches.setParams({'user': user});
        getBatches.setCallback(this,function(response){
            var state = response.getState();
            if(component.isValid && state==='SUCCESS'){
                component.set('v.Batches',response.getReturnValue());
            }else if(state==='ERROR'){
                console.log('Server error occured');
            } else{
                console.log('Unknown Error has occured');
            }
        });
        $A.enqueueAction(getBatches);
        $A.enqueueAction(getPTOS);
        
    },
    addNewPTO : function(component, event, helper){
        var pending = component.get('v.pendingPTOs');
        
        var newId = event.getParam('newPTO');
        var newStartDate = event.getParam('startDate');
        var newPTO = {Id:newId, StartDate__c:newStartDate};
        console.log(newPTO);
        pending.push(newPTO);
        component.set('v.pendingPTOs', helper.sortPTOs(pending));
    },
    approvedPTOClicked : function(component, event, helper) {
        var tab = component.get('v.tab');
        if(tab!=1){
            tab = 1;
            component.set('v.tab', tab);
        }
    },
    pendingPTOClicked : function(component, event, helper) {
        var tab = component.get('v.tab');
        if(tab!=2){
            tab = 2;
            component.set('v.tab', tab);
        }
    },
    newPTOClicked : function(component, event, helper) {
        var tab = component.get('v.tab');
        if(tab!=3){
            tab = 3;
            component.set('v.tab', tab);
        }
    },
    prevPTOIsClicked : function(component, event, helper){
        var isClicked = component.get('v.prevIsClicked');
        if(isClicked){
            var newApproved = component.get('v.newApprovedPTOs');
            var oldApproved = component.get('v.oldApprovedPTOs');
            var all = newApproved.concat(oldApproved);
            component.set('v.approvedPTOs', helper.sortPTOs(all));
            component.set('v.prevIsClicked', false);
        }
        else{
            var newApproved =component.get('v.newApprovedPTOs');
            component.set('v.approvedPTOs', null);
            component.set('v.approvedPTOs', newApproved);
            component.set('v.prevIsClicked', true);
        }
    }
})