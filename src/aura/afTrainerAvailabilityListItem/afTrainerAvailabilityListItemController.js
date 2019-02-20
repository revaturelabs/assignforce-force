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
                console.log(allSkills[i].Training_Track__c);
                if(allSkills[i].Training_Track__c==selected){
                    hasSkill = true;
                    console.log('HasSkill');
                }
            }
        }
        component.set('v.hasSkill', hasSkill);
        console.log('Selected' + selected);
        
    },
    selectIsClicked : function(component, event, helper){
        var selectedEvt = $A.get('e.c:TrainerSelected');
        var trainer = component.get('v.trainer');
        console.log('trainer' + trainer);
        selectedEvt.setParams({'trainer':trainer});
        selectedEvt.fire();
    }
})