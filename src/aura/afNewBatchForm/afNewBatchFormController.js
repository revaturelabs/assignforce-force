({
    doInit : function(component, event, helper) {
        
        var allRooms = [];
        var action = component.get("c.allRooms");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                allRooms = response.getReturnValue();
                console.log('Success!');
                
                console.log('Stringified: ' + JSON.stringify(allRooms[0].Id));
                console.log('Unstringified: ' + allRooms[0].Id);
                
                console.log('Stringified: ' + JSON.stringify(allRooms[0].TrainingLocation__c));
                console.log('Unstringified: ' + allRooms[0].TrainingLocation__c);
                console.log('[0]: ' + JSON.stringify(allRooms[0]));
                console.log('[1]: ' + JSON.stringify(allRooms[1]));
                console.log('[2]: ' + JSON.stringify(allRooms[2]));
                component.set("v.roomList", allRooms);
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
        console.log("allRooms: " + allRooms);
        
        $A.enqueueAction(action);
    },
    
    changeEndDate : function(component, event, helper) {

        var startDate = new Date(component.get("v.startDate"));
        var numWeeks = component.get("v.numWeeks");
        var endDate = new Date();

        if(startDate.getDay() == 0){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 4);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 1){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 3);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 2){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 2);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 3){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 1);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 4){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7));
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 5){ //saturday
            component.set("v.endDate", "");
            component.find("endDate").set("v.disabled", true);
        } else if(startDate.getDay() == 6){ //sunday
            component.set("v.endDate", "");
            component.find("endDate").set("v.disabled", true);
        }
        
    }, 
    clearBatchFields : function(component, event, helper) {    
        component.set("v.uncleared", false);
        component.set("v.uncleared", true);
        console.log("getting Called");
        
        //get component values
        var startDate = new Date(component.get("v.startDate"));
        var endDate = new Date(component.get("v.endDate"));
        var trainingTrack = component.get("v.track");
        var numberOfWeeks = component.get("v.numWeeks");
        var trainer = component.get("v.trainer");
        var cotrainer = component.get("v.cotrainer");
        var trainingLocation = component.get("v.location");
        var trainingRoom = component.get("v.room");
        
        var roomList     = component.get("v.roomList");
        var availRooms  = component.get("v.availRooms");
        
        
        //set component values to empty
      
        startDate = component.set("v.startDate", new Date());
        trainingRoom = component.set("v.room", " ");
        numberOfWeeks = component.set("v.numWeeks", 10);
        trainingLocation = component.set("v.location", "");
        trainingTrack = component.set("v.track", "");
        trainingRoom = component.set("v.room", "");
        trainer = component.set("v.trainer", "");
        cotrainer = component.set("v.cotrainer", "");
		endDate = component.set("v.endDate", new Date());
        
        //roomList = component.set("v.roomList", []);
        availRooms = component.set("v.availRooms", []);
        
    },
    
    
    findRooms : function(component, event, helper) {
        var loc       = component.get("v.location");
        var allRooms = component.get("v.roomList");
        var availRooms = [];
        
        console.log(loc);
        
        for (var i = 0; i < allRooms.length; i++) {
            if (allRooms[i].TrainingLocation__c == loc) {
                console.log(allRooms[i].Name);
                console.log(loc);
                availRooms.push(allRooms[i]);
            }
        }
        console.log('availRooms: ' + availRooms);
        component.set("v.availRooms", availRooms);
        
    },
    
    save : function(component, event, helper) {
        var form = component.find("newBatchForm");
        
        var submit = component.get("c.submitNewBatch");
        submit.setParams({ newBatch : component.find("newBatchForm") });
        
        submit.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log('Success!');
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
        $A.enqueueAction(submit);
    }
})