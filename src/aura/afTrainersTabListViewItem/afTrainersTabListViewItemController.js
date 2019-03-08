({
   doInit : function(component, event, helper) {

       var getSkillsAction = component.get("c.getTrainerSkills");
       getSkillsAction.setParams({
           "trainerId" : component.get("v.trainerId")
       });

       getSkillsAction.setCallback(this, function(response) {
           var state = response.getState();
           if (state === "SUCCESS") {
               if(response.getReturnValue() != null){
               var skills = response.getReturnValue();
               }
               component.set("v.skills", skills);
               
           } else if (state === "ERROR"){
               var errors = response.getError();
               if (errors) {
                   if (errors[0] && errors[0].message) {
                       console.log('Error message: ' + errors[0].message);
                   }
               }
           } else {
               console.log('Unknown error.')
           }
       })
       $A.enqueueAction(getSkillsAction);
   },

    select : function(component, event, helper) {
        var selectedEvt = $A.get('e.c:TrainerSelected');
       var trainerId = component.get('v.trainerId');

       selectedEvt.setParams({'trainerId':trainerId});
       selectedEvt.fire();        
    }
})