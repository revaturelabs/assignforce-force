({
	//DoInit- gets the skills for a related external trainer ID and sets a callback for retrieving all external trainer Information.
	doInit : function(component, event, helper) {
		//Gets the getTrainerSkills method
		var getSkillsAction = component.get("c.getTrainerSkills");
		//Sets related Id
		getSkillsAction.setParams({
			"ExternalTrainerId" : component.get("v.ExternalTrainerId")
		});
		//Callback from getTrainerSkills to return all skills
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
	//Seelect function is a method call from the component. It's related to the select button.
	//Fires ExternalTrainerSelected Event, setting the respective ExternalTrainerId
	 select : function(component, event, helper) {
		 
		var selectedEvt = $A.get('e.c:ExternalTrainerSelected');
		var trainerId = component.get('v.ExternalTrainerId');
		//sets the variable trainerId to ExternalTrainerId paramater on the handler(Might need to change variable names)
		//Handler for this event is on afExternalTrainerTabBatches
		selectedEvt.setParams({'ExternalTrainerId':trainerId});
		selectedEvt.fire();        
	 }
 })