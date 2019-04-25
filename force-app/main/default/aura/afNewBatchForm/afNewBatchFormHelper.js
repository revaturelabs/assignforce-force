({
    changeEndDate : function(component, event) {
        
        var startDate = new Date(component.get("v.startDate"));	// get startDate
        var numWeeks = component.get("v.numWeeks");				// get numWeeks
        var endDate = startDate;								// initialize endDate based on startDate
        var offset = 4 - startDate.getDay();					// offset = days to end of workweek
        
        // Monday - Wednesday
        if(0 <= startDate.getDay() && startDate.getDay() <= 2) {
            // For batches starting on Wednesday, first week ends Friday of the next week
            if(startDate.getDay() == 2) {
                endDate.setDate(startDate.getDate() + (numWeeks*7) + offset);
            // For batches starting Monday/Wednesday, first week ends Friday of starting week
            } else {
                endDate.setDate(startDate.getDate() + ((numWeeks-1)*7) + offset);
            }
            // convert to legible date format
            let year = endDate.getUTCFullYear(); 
            let month = endDate.getUTCMonth(); 
            let date = endDate.getUTCDate();
            
            if(endDate.getUTCDay() === 4){
                date+=1;
            }
            month = ("0" + (month + 1)).slice(-2);
            date = ("0" + date).slice(-2);

            component.set("v.endDate", (year + "-" + month + "-" + date));
            
        } else { // Thursday || Friday || Saturday || Sunday (no batches start here)
            component.set("v.endDate", null);
        }
    },
    
    clear : function(component, event) {   
        
        // refresh the aura:if containing the recordEditForm
        component.set("v.uncleared", false);        
        // reset Location ltng:select to start with an empty value
        var allLocs = component.get("v.allLocations");
        if(allLocs[0] != null) {
        	allLocs.unshift(null);
        	component.set("v.allLocations", allLocs);
        }
        
        //set component values (that aren't handled in doInit) to empty
        component.set("v.track", '');
        component.set("v.startDate", null);
        component.set("v.numWeeks", 10);
        component.set("v.endDate", null);
        component.set("v.trainer", ''); 
        component.set("v.cotrainer", '');
        component.set("v.ExternalTrainer", '');
        component.set("v.location", null);
        component.set("v.room", null);
        
        component.set("v.roomsForLocation", []);
        //Hidden location and hidden room are used for batch creation -> Iteration 1 Implementation
        component.set("v.hiddenLoc", "");
        component.set("v.hiddenRoom", "");
        
        component.set("v.uncleared", true);

    },
    
    showTrainerToast : function(helper, event, trainings, trainer, startDate, endDate) {
        
        // convert selected start/end dates into JS Date format
        var newStart = new Date(startDate);
        var newEnd = new Date(endDate);
        
        for (var i = 0; i < trainings.length; i++) {
            // if training[i] is associated with the selected trainer/cotrainer...
            if(trainer != null && trainer != "" && (trainer == trainings[i].Trainer__c || trainings[i].CoTrainer__c)) {
                // convert start/end dates of training[i] into JS Date format
                var prevStart = new Date(trainings[i].StartDate__c);
                var prevEnd = new Date(trainings[i].EndDate__c);
                
                // if selected dates overlap with existing training dates...
                if((prevStart <= newStart    && newStart <= prevEnd) || 
                   (prevStart <= newEnd  && newEnd <= prevEnd) || 
                   (prevStart >= newStart    && newEnd >= prevEnd)) {
                    // display toast
                    var toastEvent = $A.get("e.force:showToast");
                    
                    toastEvent.setParams({
                        title : 'Notice',
                        message: 'The trainer you selected is scheduled to be training another batch at the start date you selected.',
                        duration: 5000,
                        type: 'info',
                    });
                    toastEvent.fire();
                }
            }
        } 
    }
})