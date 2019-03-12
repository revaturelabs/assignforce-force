({
    sortTrainers : function(trainerList) {
        // sort method that sorts the trainers by available first then by name
        var trainersAvailable = [];
        var trainersAvailablePlusHasSkill = [];
        var trainersUnavailable = [];
        for(var i=0; i<trainerList.length;i++){
            if(trainerList[i].Available__c=="Available" && trainerList[i].hasSkill==true){
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
            trainers[i].hasSkill = false;
        }
        return trainers;
    },
    sortAlphabetically : function(listToSort){
        return listToSort.sort((a,b) => (a.Name>b.Name) ? 1 :-1);
    },
})