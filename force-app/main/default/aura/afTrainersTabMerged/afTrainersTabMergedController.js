({
    //Change active tab to PTO tab
    afTrainersTabPTOClicked : function(component, event, helper) {
        var tab = component.get('v.tab');
        if(tab!=1){
            tab = 1;
            component.set('v.tab', tab);
        }
    },
    //Change active tab to batches tab
    afTrainersTabBatchesClicked : function(component, event, helper) {
        var tab = component.get('v.tab');
        if(tab!=2){
            tab = 2;
            component.set('v.tab', tab);
        }
    }
})