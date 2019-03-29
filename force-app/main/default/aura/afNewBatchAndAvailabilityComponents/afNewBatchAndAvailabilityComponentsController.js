({
	doInit : function(component, event, helper) {
        //Get all locations from APEX SOQL Query and pass back to component attribute
        var allLocs = [];
        var getLocations = component.get("c.masterLocations");      
        getLocations.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                allLocs = response.getReturnValue();
                allLocs.unshift(null);
                component.set("v.allLocations", allLocs);   
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message);
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0000}')
            }
        })
        $A.enqueueAction(getLocations);
        
        //Get all Rooms from APEX SOQL Query and pass back to component attribute
        var getRooms = component.get("c.masterRooms");       
        getRooms.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.allRooms", response.getReturnValue());                
                
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0001}')
            }
        })
        $A.enqueueAction(getRooms);
        
        //Get all Skills from APEX SOQL Query and pass back to component attribute
        var getSkills = component.get("c.masterSkills");
        getSkills.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set('v.allSkills', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0002}');
            }
        });
        $A.enqueueAction(getSkills);
        
        //Get all Trainers from APEX SOQL Query and pass back to component attribute
        var getTrainers = component.get("c.masterTrainers");
        getTrainers.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set('v.allTrainers', response.getReturnValue());
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0003}');
            }
        });
        $A.enqueueAction(getTrainers);
        
        //Get all Trainings from APEX SOQL Query and pass back to component attribute
        var getTrainings = component.get("c.masterOpenTrainings");
        getTrainings.setCallback(this, function(response) {
            var state = response.getState();
            if (component.isValid() && state === "SUCCESS") {
                component.set('v.openTrainings', response.getReturnValue());                
            } else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message)
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0004}');
            }
        });
        $A.enqueueAction(getTrainings);
		        
	}
})