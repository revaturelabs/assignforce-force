({
    getData : function(cmp) {
        
        let action = cmp.get("c.getTrainingBatches");
        
        action.setCallback(this, function(response){
            let state = response.getState();
            
            if (cmp.isValid && state === "SUCCESS"){
                var temp = response.getReturnValue();
                this.modGetData(cmp, temp);
            }
            
            
            else if (state === "ERROR"){
                let errors = response.getError();
                console.error(errors);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    modGetData : function(cmp, temp){
        var returnedTraining = temp;
        var trainings = [];
        for(var i = 0 ; i < returnedTraining.length ; i++){
            
            var endDateString = new Date(returnedTraining[i].EndDate__c);
            var startDateString = new Date(returnedTraining[i].StartDate__c);
            let endYear = endDateString.getUTCFullYear();
            let endMonth = endDateString.getUTCMonth();
            let endDay =  endDateString.getUTCDate();
            let startYear = startDateString.getUTCFullYear();
            let startMonth = startDateString.getUTCMonth();
            let startDay = startDateString.getUTCDate();
            
            
            var endDate = (endYear + "-" + (endMonth+1) + "-" + (endDay));
            var startDate = (startYear + "-" + (startMonth+1) + "-" + (startDay));
            trainings.push({
                Id : returnedTraining[i].Id,
                Name: returnedTraining[i].Name,
                TrainingClass__c : returnedTraining[i].TrainingClass__c,
                StartDate__c : startDate,
                EndDate__c : endDate,
                Status__c : returnedTraining[i].Status__c,
                officeName : returnedTraining[i].TrainingLocation__r.OfficeName__c,
                track : returnedTraining[i].TrainingTrack__r.ShortName__c,
                trainer : returnedTraining[i].Trainer__r.Name,
                coTrainer : returnedTraining[i].CoTrainer__r.Name
            });
        }
        cmp.set('v.batchesData', trainings);
    },
    
    deleteBatchesHelper : function(cmp){
        
        var action = cmp.get("c.deleteBatchesServer");
        var selectedBatches = cmp.get('v.selectedRows');
        var batchIds = [];
        
        for(var i = 0 ; i < selectedBatches.length ; i++){
            batchIds.push(selectedBatches[i].Id);
        }
        
        action.setParams({'batchIds' : batchIds});
        action.setCallback(this, function(response){
            var state = response.getState();
            if(cmp.isValid() && state === 'SUCCESS'){
                this.getData(cmp);
                cmp.set('v.selectedRows', []);
                var dataTable = cmp.find("dataTable");
                if(dataTable){
                    dataTable.set("v.selectedRows", []);            
                }  
            }
            else
            {
                alert('There was an error. Please contact your Administrator!');
            }
        });
        $A.enqueueAction(action);
    },
    
    saveDataTable : function(cmp){
        var editedRecords =  cmp.find("dataTable").get("v.draftValues");
        console.log('edited Records: ' + JSON.stringify(editedRecords));
        
        var action = cmp.get("c.updateBatchesServer");
        action.setParams({"updatedBatches" : editedRecords});
        action.setCallback(this, function(response){
        });
        $A.enqueueAction(action);
        cmp.find("dataTable").set("v.draftValues", null);
       
        this.reloadDataTable();
        this.getData(cmp);
        
       
    },
    reloadDataTable : function(cmp){
    var refreshEvent = $A.get("e.force:refreshView");
        console.log(refreshEvent);
        if(refreshEvent){
            refreshEvent.fire();
            console.log("it is getting past fire");
            //this.getData(cmp);
        }
    },
   
    
    //After update, cmp.find("table-cmp-id").set("v.draftValues", null); to clear the cells and remove buttons
})