({
    //Responsible for server callback and filtering results for trainer by when batches are planned
    getData : function(component, event) {
        var userId = event.getParam("trainerId");
        component.set("v.userId",userId);
        let action = component.get("c.getTrainingBatchesById");
        action.setParams({"userId" : userId});
        action.setCallback(this, function(response){
            let state = response.getState();
            if (component.isValid && state === "SUCCESS"){
                var temp = response.getReturnValue();
                
                //if response value is empty hasBatches will be false and will not render both data tables
                if(temp.length == 0){
                    component.set('v.hasBatches', false);
                    component.set('v.hasSelected', true);
                }
                //if response value is not empty hasBatches will be true and will render both data tables
                else if (temp.length > 0){
                    component.set('v.hasBatches', true);
                    component.set('v.hasSelected', true);
                }
                
                var tempCurrent = [];
                var tempFuture = [];
                /*Loops through all the response values searches and then filters by status to determine
                whether a batch should be on the current batches data table or upcoming batches data table
                */
                for(var i = 0; i < temp.length; i++)
                {
                    if( temp[i].Status__c == 'Planned' || temp[i].Status__c == 'Confirmed' )
                    {
                        tempFuture.push(temp[i]);
                    }
                    else if(temp[i].Status__c == 'In Progress'  ){
                        tempCurrent.push(temp[i]);
                    }
                }
                //Calls modGetData which is responsible for putting values on data table
                this.modGetData(component, tempCurrent, tempFuture);
            }
            else if (state === "ERROR"){
                let errors = response.getError();
                console.error(errors);
            }
        });
        $A.enqueueAction(action);
        
    },
    //Modifies incoming data in order for the lightning data table to display it
    modGetData : function(component, tempCurrent, tempFuture){
        //Sets returnedTraining and returnedFutureTrainings to values from getData
        var returnedTraining = tempCurrent;
        var returnedFutureTrainings = tempFuture;
        //Populates values from server *Ask Jeramiah
        var trainings = [];
        var futureTrainings = [];
        
        //Loops through an array of current batches in order to show values on data table
        for(var i = 0 ; i < returnedTraining.length ; i++){
            var tempObj = returnedTraining[i];
            var endDateString = new Date(tempObj.EndDate__c);
            var startDateString = new Date(tempObj.StartDate__c);
            var endDate =  this.endDateHandler(endDateString);
            var startDate = this.startDateHandler(startDateString);
            trainings.push(this.addToArray(tempObj , endDateString, startDateString));
            
        }
        //Loops through an array of upcoming batches in order to show values on the upcoming batches datatable
        for(var j = 0; j < returnedFutureTrainings.length; j++){
            var tempObj = returnedFutureTrainings[j];
            var endDateString = new Date(tempObj.EndDate__c);
            var startDateString = new Date(tempObj.StartDate__c);
            var endDate =  this.endDateHandler(endDateString);
            var startDate = this.startDateHandler(startDateString);
            futureTrainings.push(this.addToArray(tempObj , endDateString, startDateString));
        }
        
        //sets the values from trainings to current batch datatable and futureTrainings to upcoming batch table
        component.set('v.empCurrentBatchDataset', trainings);
        component.set('v.empFutureBatchDataset', futureTrainings);
        
    },
    //Used for decoupling start date information then it is called from modGetData
    startDateHandler : function(startDateString){
        /*  var startYear = startDateString.getUTCFullYear();
           var startMonth = startDateString.getUTCMonth();
           var startDay =  startDateString.getUTCDate();
           var startDayHours = startDateString.getUTCHours();
           var startDayMins = startDateString.getUTCMinutes();
        return new Date(startYear,startMonth,startDay +1);*/
    },
    //Used for decoupling  end date information called from modGetData
    //Used for conversion between apex and javaScript break it apart 
    endDateHandler : function(endDateString){
        /*
           var endYear = endDateString.getUTCFullYear();
           var endMonth = endDateString.getUTCMonth();
           var endDay =  endDateString.getUTCDate();
           var endDayHours = endDateString.getUTCHours();
        return new Date(endYear,endMonth,endDay +1);*/
    },
    //Called from modeGetData to reference key value pairs
    addToArray : function(tempObj, endDateString, startDateString){
        var startYear = startDateString.getUTCFullYear();
        var startMonth = startDateString.getUTCMonth();
        var startDay =  startDateString.getUTCDate();
        var endYear = endDateString.getUTCFullYear();
        var endMonth = endDateString.getUTCMonth();
        var endDay =  endDateString.getUTCDate();
        var tempArray = {   
            startDate : startDateString = new Date(startYear, startMonth, startDay + 1) ,
            endDate : endDateString = new Date (endYear,endMonth,endDay +1) ,
            status : tempObj.Status__c,
            
            track : tempObj.TrainingTrack__r.ShortName__c,
            
        };
        return tempArray;
    },
    
})