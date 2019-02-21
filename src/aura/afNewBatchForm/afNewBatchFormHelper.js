({
    changeEndDate : function(component, event, helper) {
        
        var startDate = new Date(component.get("v.startDate"));
        var numWeeks = component.get("v.numWeeks");
        var endDate = startDate;
        var offset = 4 - startDate.getDay();
        
        // Monday - Wednesday
        if(0 <= startDate.getDay() && startDate.getDay() <= 2) {
            if(startDate.getDay() == 2) {
                endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + offset);
            } else {
                endDate.setDate(startDate.getUTCDate() + ((numWeeks-1)*7) + offset);
            }
            let year = endDate.getFullYear(); 
            let month = endDate.getMonth(); 
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
            
        } else { // Thursday || Friday || Saturday || Sunday
            component.set("v.endDate", "");
        }
        
        //this.showTrainerToast(this, event, trainings, trainer, startDate, endDate);
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
        var roomsForLocation       = component.get("v.roomsForLocation");
        
        
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
        
        roomsForLocation       = component.set("v.roomsForLocation", []);
        
    },
    
    showTrainerToast : function(helper, event, trainings, trainer, startDate, endDate) {
        
        console.log('we made it');
        var newStart = new Date(startDate);
        var newEnd = new Date(endDate);
        for (var i = 0; i < trainings.length; i++) {
            //console.log('has length');
            if(trainer != null && trainer != "" && (trainer == trainings[i].Trainer__c || trainings[i].CoTrainer__c)) {
                //console.log('first conditional');
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