({
    changeEndDate : function(component, event, helper) {
        
        var startDate = new Date(component.get("v.startDate"));	// get startDate
        var numWeeks = component.get("v.numWeeks");				// get numWeeks
        var endDate = startDate;								// initialize endDate based on startDate
        var offset = 4 - startDate.getDay();					// offset = days to end of workweek
        
        // Monday - Wednesday
        if(0 <= startDate.getDay() && startDate.getDay() <= 2) {
            // For batches starting on Wednesday, first week ends Friday of the next week
            if(startDate.getDay() == 2) {
                endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + offset);
                // For batches starting Monday/Wednesday, first week ends Friday of starting week
            } else {
                endDate.setDate(startDate.getUTCDate() + ((numWeeks-1)*7) + offset);
            }
            // convert to legible date format
            let year = endDate.getFullYear(); 
            let month = endDate.getMonth(); 
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
            startDate = component.get("v.startDate");
            endDate = component.get("v.endDate");
            var dateEvent = $A.get("e.c:afNewBatchFormDateEvent");
            dateEvent.setParams({
                "startDate" : startDate,
                "endDate"    : endDate
            });
            console.log('dateChanged');
            dateEvent.fire();
            
        } else { // Thursday || Friday || Saturday || Sunday (no batches start here)
            component.set("v.endDate", "");
        }
        
        // pass new start/end dates to application event
        var dateEvent = $A.get("e.c:afNewBatchFormDateEvent"); 
        dateEvent.setParams({
            "startDate" : startDate,
            "endDate"	: endDate
        });
        console.log('dateChanged');
        dateEvent.fire();
    },
    
    clear : function(component, event) {   
        
        // refresh the aura:if containing the recordEditForm
        component.set("v.uncleared", false);
        component.set("v.uncleared", true);
        
        //set component values (that aren't handled in doInit) to empty
        component.set("v.cotrainer", "");
        component.set("v.endDate", new Date());
        component.set("v.hiddenRoom", "");
        component.set("v.location", "");
        component.set("v.numWeeks", 10);
        component.set("v.room", "");
        component.set("v.roomsForLocation", []);
        component.set("v.startDate", new Date());
        component.set("v.track", "")
        component.set("v.trainer", ""); 
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
                        mode: 'sticky',
                        type: 'info',
                    });
                    toastEvent.fire();
                }
            }
        } 
    },
})