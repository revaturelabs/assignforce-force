({
    sortTrainers : function(trainerList) {
        // sort method that sorts the trainers by available first then by name
        var trainersAvailable = [];
        var trainersAvailablePlusHasSkill = [];
        var trainersUnavailable = [];
        for(var i=0; i<trainerList.length;i++){
            if(trainerList[i].Available__c=="Available" && trainerList[i].hasSkill__c==true){
                trainersAvailablePlusHasSkill.push(trainerList[i]);
            }else if(trainerList[i].Available__c=="Available"){
                trainersAvailable.push(trainerList[i]);
            }
                else{
                    trainersUnavailable.push(trainerList[i])
                }
        }
        trainersAvailable = this.sortAlphabetically(trainersAvailable);
        trainersAvailablePlusHasSkill = this.sortAlphabetically(trainersAvailablePlusHasSkill);
        trainersUnavailable = this.sortAlphabetically(trainersUnavailable);
        var everyone = trainersAvailablePlusHasSkill.concat(trainersAvailable, trainersUnavailable);
        // console.log('combined lists ' + everyone);
        return everyone;
        
    },
    
    sortTrainingRoom : function(trainingRoomList) {
        // sort method that sorts the trainers by available first then by name
        var trainingRoomAvailable = [];
        var trainingRoomUnavailable = [];
        for(var i=0; i<trainingRoomList.length;i++){
            if(trainingRoomList[i].AVAvailability__c=="Yes"){
                trainingRoomAvailable.push(trainingRoomList[i]);
            }else{
                    trainingRoomUnavailable.push(trainingRoomList[i])
                }
            }
        trainingRoomAvailable = this.sortAlphabetically(trainingRoomAvailable);
        trainingRoomUnavailable = this.sortAlphabetically(trainingRoomUnavailable);
        var everyone = trainingRoomAvailable.concat(trainingRoomUnavailable);       
        return everyone;
        
    },
    
    checkHasSkill : function(trainers, skills, selectedTrainingTrack){
        trainers = this.resetHasSkill(trainers);
        if(selectedTrainingTrack!=null){
            for(var i=0; i<trainers.length; i++){
                for(var j=0; j<skills.length; j++){
                    if(skills[j].Trainer__c==trainers[i].Id){
                        if(skills[j].Training_Track__c==selectedTrainingTrack){
                            trainers[i].hasSkill = true;
                            break;
                        }
                        else{
                            trainers[i].hasSkill = false;
                        }
                    }
                }
            }
        }
        else{
            for(var k=0; k<trainers.length; k++){
                trainers[k].hasSkill=false;
            }
        }
        return trainers;
    },
    resetHasSkill : function(trainers){
        for(var i=0; i<trainers.length; i++){
            trainers[i].hasSkill__c = true;
        }
        return trainers;
    },
    
    sortAlphabetically : function(listToSort){
        return listToSort.sort((a,b) => (a.Name>b.Name) ? 1 :-1);
    },
    
    //This method will determine which trainers should be displayed based on pagination
    //You could probally make all fill sublist methods into one method since they take in the same parameters.
    updateTrainersSubList : function(trainerList, offset, pageSize) {
        //console.log('updateTrainer is starting');
		var trainersOnPage = [];       
        offset *= pageSize;
        var i;
        for(i=offset; i<pageSize+offset && i<trainerList.length ; i++){ //
            trainersOnPage.push(trainerList[i]);
        }
        //console.log('updateTrainer has finished');
        return trainersOnPage;
    },
    
    //This method will determine which rooms should be displayed based on pagination
    updateRoomsSubList : function(roomList, offset, pageSize) {
		var roomsOnPage = [];       
        offset *= pageSize;
        var i;
        for(i=offset; i<pageSize+offset && i<roomList.length ; i++){ //
            roomsOnPage.push(roomList[i]);
        }
        return roomsOnPage;
    },
    
    //This method will determine which external trainers should be displayed based on pagination
    updateExternalTrainersSubList : function(trainerList, offset, pageSize) {
        //The current problem is that every trainer is in one string so its an array of size one.
        console.log('updateExtTrainer is starting');
		var trainersOnPage = [];       
        offset *= pageSize;
        var i;
        for(i=offset; i<pageSize+offset && i<trainerList.length ; i++){ //
            trainersOnPage.push(trainerList[i]);
        }
        console.log('master list length is: ' + trainerList.length);
        console.log('sublist is length: ' + trainersOnPage.length);
        console.log('master list is: ' + trainerList);
        console.log('sublist is: ' + trainersOnPage);
        
        console.log('updateTrainer has finished');
        return trainersOnPage;
    },
    
    /*Should be called every time a button is clicked related to pagination
     *Determines if the next button for pagination should be disabled i.e. 
     *If it should be clickable or not */
    shouldNextBeDisabled : function(list, offSet, pageSize){
        //console.log("got inside the helper method");
        var value = (offSet*pageSize) + pageSize;
        //console.log("should next be disabled\nlistSize is: "+list.length+" offset * pagesize + pagesize is: " + value);
        return list.length <= value;  
    },
    
    /*Should be called every time a button is clicked related to pagination
     *Determines if the previous button for pagination should be disabled i.e. 
     *If it should be clickable or not */
    shouldPreviousBeDisabled : function(offSet){
        //console.log("should perv be disabled\nPage is: " + offSet);
        return (1 > offSet);  
    },
    
})