({
    changeEndDate : function(component, event, helper) {
        
        var startDate = new Date(component.get("v.startDate"));
        var numWeeks = component.get("v.numWeeks");
        var endDate = startDate;
        var offset = 4 - startDate.getDay();
        
        // Monday - Wednesday
        if(0 <= startDate.getDay() && startDate.getDay() <= 2) {
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
            
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
            startDate = component.get("v.startDate");
            endDate = component.get("v.endDate");
            var dateEvent = $A.get("e.c:afNewBatchFormDateEvent");
            dateEvent.setParams({
                "startDate" : startDate,
                "endDate"    : endDate
            });
            
            dateEvent.fire();
            
            // pass new start/end dates to application event
            
        } else { // Thursday || Friday || Saturday || Sunday (no batches start here)
            component.set("v.endDate", "");
        }
    },
    
    clear : function(component, event) {   
        
        component.set("v.uncleared", false);
        component.set("v.uncleared", true);
        
        // reset Location ltng:select to start with an empty value
        var allLocs = component.get("v.allLocations");
        if(allLocs[0] != null) {
        	allLocs.unshift(null);
        	component.set("v.allLocations", allLocs);
        }
        
        //set component values (that aren't handled in doInit) to empty
        component.set("v.cotrainer", "");
        component.set("v.endDate", null);
        component.set("v.hiddenRoom", "");
        component.set("v.location", "");
        component.set("v.numWeeks", 10);
        component.set("v.room", "");
        component.set("v.roomsForLocation", []);
        component.set("v.startDate", null);
        component.set("v.track", "")
        component.set("v.trainer", ""); 
    },
    
    showTrainerToast : function(helper, event, trainings, trainer, startDate, endDate) {
        
        console.log('we made it');
        var newStart = new Date(startDate);
        var newEnd = new Date(endDate);
        for (var i = 0; i < trainings.length; i++) {
            // if training[i] is associated with the selected trainer/cotrainer...
            if(trainer != null && trainer != "" && (trainer == trainings[i].Trainer__c || trainings[i].CoTrainer__c)) {
                // convert start/end dates of training[i] into JS Date format
                var prevStart = new Date(trainings[i].StartDate__c);
                var prevEnd = new Date(trainings[i].EndDate__c);
                
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