({
    //Responsible for server callback and filtering results for trainer by when batches are planned
    getData : function(component, event) {
        //gets and sets External Trainer Id
        var userId = event.getParam("ExternalTrainerId");
        console.log("In getData " + userId);
        component.set("v.ExternalTrainerId",userId);
        //Action calls the afExternalTrainerBatchesApexController class getExtTrainingBatchesById 
        let action = component.get("c.getExtTrainingBatchesById");
        //action gets all related batches based on the external trainer Id
        action.setParams({"externalTrainerId" : userId});
        action.setCallback(this, function(response){
            console.log(response.getReturnValue);
            let state = response.getState();
            if (component.isValid && state === "SUCCESS"){
                var temp = response.getReturnValue();
                
                //if response value is empty hasBatches will be false and will not render both data tables
                if(temp.length == 0){
                    component.set('v.hasExtBatches', false);
                    component.set('v.hasExtSelected', true);
                }
                //if response value is not empty hasBatches will be true and will render both data tables
                else if (temp.length > 0){
                    component.set('v.hasExtBatches', true);
                    component.set('v.hasExtSelected', true);
                }
                
                var tempCurrent = [];
                var tempFuture = [];
                /*Loops through all the response values searches and then filters by status to determine
                whether a batch should be on the current batches data table or upcoming batches data table
                */
                /*Also sets the hasAcceptedStatus boolean called in the component to determine if the
                 *batch is to be displayed in the data table
                 * */
                for(var i = 0; i < temp.length; i++)
                {
                    if( temp[i].Status__c == 'Planned' || temp[i].Status__c == 'Confirmed' )
                    {
                        tempFuture.push(temp[i]);
                        component.set('v.hasAcceptedStatus', true);
                        component.set('v.hasAcceptedStatus', true);
                    }
                    else if(temp[i].Status__c == 'In Progress'  ){
                        tempCurrent.push(temp[i]);
                        component.set('v.hasAcceptedStatus', true);
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
            //  These are the only references to the commented-out handlers
            // var endDate =  this.endDateHandler(endDateString);
            // var startDate = this.startDateHandler(startDateString);
            trainings.push(this.addToArray(tempObj , endDateString, startDateString));
            
        }
        //Loops through an array of upcoming batches in order to show values on the upcoming batches datatable
        for(var j = 0; j < returnedFutureTrainings.length; j++){
            var tempObj = returnedFutureTrainings[j];
            var endDateString = new Date(tempObj.EndDate__c);
            var startDateString = new Date(tempObj.StartDate__c);
          //  These are the only references to the commented-out handlers
          //  var endDate =  this.endDateHandler(endDateString);
          //  var startDate = this.startDateHandler(startDateString);
            futureTrainings.push(this.addToArray(tempObj , endDateString, startDateString));
        }

        // Check if these lists are empty, if they are we want to set a boolean to false to display something else in the lightning.
        if (trainings.length > 0){
            component.set('v.hasCurrentBatch', true);
        } else{
            component.set('v.hasCurrentBatch', false);
        }
        if (futureTrainings.length > 0){
            component.set('v.hasUpcomingBatch', true);
        } else{
            component.set('v.hasUpcomingBatch', false);
        }

        //sets the values from trainings to current batch datatable and futureTrainings to upcoming batch table
        component.set('v.empExtCurrentBatchDataset', trainings);
        component.set('v.empExtFutureBatchDataset', futureTrainings);
        
    },
    
    //Used for decoupling start date information then it is called from modGetData
    //The External trainer tab batches component currently works without the use of these handlers
    //They are referenced in lines 86 and 87 so haven't yet been deleted
    //Once those references are removed without breaking functionality, these handlers can be deleted
    
    /*
    startDateHandler : function(startDateString){
        
          var startYear = startDateString.getUTCFullYear();
           var startMonth = startDateString.getUTCMonth();
           var startDay =  startDateString.getUTCDate();
           var startDayHours = startDateString.getUTCHours();
           var startDayMins = startDateString.getUTCMinutes();
        return new Date(startYear,startMonth,startDay +1);
        
    },
    */
    
    //Used for decoupling  end date information called from modGetData
    //Used for conversion between apex and javaScript break it apart 
    //In the same boat as the startDateHandler above
    
    /*
    endDateHandler : function(endDateString){
        
           var endYear = endDateString.getUTCFullYear();
           var endMonth = endDateString.getUTCMonth();
           var endDay =  endDateString.getUTCDate();
           var endDayHours = endDateString.getUTCHours();
        return new Date(endYear,endMonth,endDay +1);
        
    },
   */
    
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