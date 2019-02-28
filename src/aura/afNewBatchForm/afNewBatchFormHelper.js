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
            console.log('dateChanged');
            dateEvent.fire();
            
            // pass new start/end dates to application event
            startDate = component.get("v.startDate");
            endDate = component.get("v.endDate");
            var dateEvent = $A.get("e.c:afNewBatchFormDateEvent");
            dateEvent.setParams({
                "startDate" : startDate,
                "endDate"   : endDate
            });
            console.log('dateChanged');
            dateEvent.fire();
            
        } else { // Thursday || Friday || Saturday || Sunday (no batches start here)
            component.set("v.endDate", "");
        }
    },
    
    clear : function(component, event) {   
        
        component.set("v.uncleared", false);
        component.set("v.uncleared", true);
        
        //get component values
        var startDate        = new Date(component.get("v.startDate"));
        var endDate          = new Date(component.get("v.endDate"));
        var trainingTrack    = component.get("v.track");
        var numberOfWeeks    = component.get("v.numWeeks");
        var trainer          = component.get("v.trainer");
        var cotrainer        = component.get("v.cotrainer");
        var trainingLocation = component.get("v.location");
        var trainingRoom     = component.get("v.room");
        
        var roomList         = component.get("v.roomList");
        var availRooms       = component.get("v.availRooms");
        
        
        //set component values to empty
        
        startDate        = component.set("v.startDate", new Date());
        endDate          = component.set("v.endDate", new Date());
        trainingRoom     = component.set("v.room", "");
        numberOfWeeks    = component.set("v.numWeeks", 10);
        trainingLocation = component.set("v.location", "");
        trainingTrack    = component.set("v.track", "");
        trainingRoom     = component.set("v.room", "");
        trainer          = component.set("v.trainer", "");
        cotrainer        = component.set("v.cotrainer", "");
        
        availRooms       = component.set("v.availRooms", []);
        
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
                   (prevStart >= newStart    && newEnd >= prevEnd)) /*||
                   (trainings[i].StartDate__c <= startDate   && endDate <= trainings[i].EndDate__c))*/ {
                       console.log('toast success');
                       var toastEvent = $A.get("e.force:showToast");
                       
                       toastEvent.setParams({
                           title : 'Notice',
                           message: 'The trainer you selected is scheduled to be training another batch at the start date you selected.',
                           mode: 'sticky',
                           type: 'info',
                       });
                       toastEvent.fire();
                       console.log('toastEvent fired iteration: ' + i);
                   }
            }
        } 
    }
})