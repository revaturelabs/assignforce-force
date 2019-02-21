({

    doInit : function(component, event, helper) {
        var trainer = component.get('v.trainer');
        var allSkills = component.get('v.allSkills');
        var selected = component.get('v.selectedTrainingTrack');
        var hasSkill = false;
        if(trainer.Available__c==="Available"){
            component.set('v.isAvailable', true);
        } else{
            component.set('v.isAvailable', false);
        }
        for(var i=0; i<allSkills.length;i++){
            if(allSkills[i].Trainer__c==trainer.Id){
                if(allSkills[i].Training_Track__c==selected){
                    hasSkill = true;
                }
            }
        }
        component.set('v.hasSkill', hasSkill);
        
    },
    selectIsClicked : function(component, event, helper){
        var selectedEvt = $A.get('e.c:TrainerSelected');
        var trainer = component.get('v.trainer');
        selectedEvt.setParams({'trainer':trainer});
        selectedEvt.fire();
    },
})