({
    //Responsible for server callback and filtering results for trainer by when PTOs are planned
    getData : function(component, event) {
        var userId = event.getParam("trainerId");
        component.set("v.userId",userId);
        
        //Gets current date in order to compare values in if statement below
        var currentDate = new Date();
        var todaysYear 	= currentDate.getUTCFullYear();
        var todaysMonth = currentDate.getUTCMonth() ;
        var todaysDate 	= currentDate.getUTCDate() ;
        
        currentDate = (todaysYear + "-0" + (todaysMonth+1) + "-0" + todaysDate);       
        let action = component.get("c.getTrainingPTOById");
        action.setParams({"userId" : userId});
        action.setCallback(this, function(response){
            let state = response.getState();
            
            if (component.isValid && state === "SUCCESS"){
                
                var temp = response.getReturnValue();
                
                //if response value is empty hasPTO will be false and will not render both data tables
                if(temp.length == 0){
                    component.set('v.hasPTO', false);
                    component.set('v.selectedPTO', true);
                }
                //if response value is not empty hasPTO will be true and will render both data tables
                else if (temp.length > 0){
                    component.set('v.hasPTO', true);
                    component.set('v.selectedPTO', true);
                }
                
                var tempCurrent = [];
                var tempFuture = [];
                
                /*Loops through all the response values searches and then filters by status to determine
                whether a batch should be on the current PTOs data table or upcoming PTOs data table
                */
                for(var i = 0; i < temp.length; i++)
                {
                    
                    if(temp[i].EndDate__c > currentDate && temp[i].StartDate__c > currentDate )
                    {
                        var tempFutureCounter = 0;
                        tempFuture.push(temp[i]);
                        
                        
                    }
                    if(temp[i].StartDate__c  <= currentDate && temp[i].EndDate__c > currentDate){
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
        var returnedPTOs = tempCurrent;
        var returnedFuturePTOs = tempFuture;
        var PTOs = [];
        var futurePTOs = [];
        
        //Loops through an array of current PTOs in order to show values on data table
        for(var i = 0 ; i < returnedPTOs.length ; i++){
            var tempObj = returnedPTOs[i];
            var endDateString = new Date(tempObj.EndDate__c);
            var startDateString = new Date(tempObj.StartDate__c);
            //var endDate =  this.endDateHandler(endDateString);
            //var startDate = this.startDateHandler(startDateString);
            PTOs.push(this.addToArray(tempObj , endDateString, startDateString));
            
        }
        //Loops through an array of upcoming PTOs  in order to show values on the upcoming PTOs datatable
        for(var j = 0; j < returnedFuturePTOs.length; j++){
            var tempObj = returnedFuturePTOs[j];
            var endDateString = new Date(tempObj.EndDate__c );
            var startDateString = new Date(tempObj.StartDate__c );
            //var endDate =  this.endDateHandler(endDateString);
            //var startDate = this.startDateHandler(startDateString);
            futurePTOs.push(this.addToArray(tempObj , endDateString, startDateString));
        }
        
        //sets the values from trainings to current PTOs datatable and futureTrainings to upcoming PTOs table
        component.set('v.empCurrentPTODataset', PTOs);
        component.set('v.empFuturePTODataset', futurePTOs);
        
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
            endDate : endDateString = new Date(endYear, endMonth,endDay + 1) ,
            status : tempObj.Status__c,
            reason : tempObj.Reason__c,
            Id : tempObj.Id
        };
        return tempArray;
    },

})