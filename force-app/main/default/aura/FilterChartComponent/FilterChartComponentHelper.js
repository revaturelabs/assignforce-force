({
    setInitYear : function(component, event)
    {
        var today = new Date();
        var year = today.getFullYear();
        var choices = {
            selectedYearId: 2,
            years: [
                {id: 1, label: year + 1},
                { id: 2, label: year, selected: true},
                { id: 3, label: year - 1},
                { id: 4, label: year - 2 },
                {id: 5, label: 'All'}
            ]
        };
        component.set('v.yearOptions', choices.years);
        component.set('v.selectedYear', choices.selectedYearId);
    },
    
    setInitMonth : function(component, event)
    {
        var quarters = ['Choose one...','Q1', 'Q2', 'Q3', 'Q4'];
        
        var choices = {
            selectedQuarterId: 1,
            quarter: [
                { id: 1, label: quarters[0], selected: true },
                { id: 2, label: quarters[1]},
                { id: 3, label: quarters[2]},
                { id: 4, label: quarters[3]},
                { id: 5, label: quarters[4]}
            ]
        };
        component.set('v.quarterOptions', choices.quarter);
        component.set('v.selectedQuarter', choices.selectedQuarterId);
    },
    
    setLocation : function(component, event) 
    {
        var action = component.get('c.getTrainingLocations');
        
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS')
            {
                var Locations = response.getReturnValue();
                this.fireLocationEvent(component, event, Locations);
            }
            else if(state === 'ERROR')
            {
                alert("There was an error with your Callback.");
            }
            else
            {
                alert("There is an unknown error. Please contact your Administrator.");
            }
        });
        
        $A.enqueueAction(action);
    },
    
    fireLocationEvent : function(component, event, Locations)
    {
        var getLocation = component.getEvent("SetLocations");
        var newString = Locations.toString();
        var newArray = newString.split(',');
        var NoDupesArray = [];
        for(var i = 0; i < newArray.length; i++)
        {
            if(!NoDupesArray.includes(newArray[i]))
            {
                NoDupesArray.push(newArray[i]);
            }
        }
        component.set('v.AllLocations', NoDupesArray);
        getLocation.setParam(
            "listOfLocations" , component.get('v.AllLocations')
        );
         
        getLocation.fire();
    },
    
    filterByChange : function(component, event)
    {
        var changeValue = component.get('v.value');//event.getParam("value");
        
        if(changeValue == undefined)
        {
            changeValue = [];
        }
        
        var action; 
        
        component.set('v.selectedLocations', changeValue);
        var Locations = component.get('v.selectedLocations');
        if(component.get('v.selectedQuarter') != 1 && changeValue.length != 0)
        {
            action = component.get('c.filterTrainingsByYearLocationQuarter');
            
            action.setParams({
                'location' : Locations,
                'year' : component.get('v.selectedYear'),
                'quarter' : component.get('v.selectedQuarter')
            });
        }
        else if(changeValue.length != 0 && component.get('v.selectedQuarter') == 1)
        {
            action = component.get('c.filterTrainingsByYearLocation');
            
            action.setParams({
                'location' : Locations,
                'year' : component.get('v.selectedYear')
            });
        }
        else if(component.get('v.selectedQuarter') != 1)
        {
            action = component.get('c.filterTrainingsByYearQuarter');
            
            action.setParams({
               	'year' : component.get('v.selectedYear'),
                'quarter' : component.get('v.selectedQuarter')
            });
        }
        else
        {
         	action = component.get('c.filterTrainingsByYear');
            
            action.setParams({
                'year' : component.get('v.selectedYear')
            });
        }
       	
        // console.log("action: " + JSON.stringify(action));
        action.setCallback(this, function(response){
            var state = response.getState();
            if(/*component.isValid() &&*/ state === 'SUCCESS')
            {
                var data = JSON.parse(response.getReturnValue());
                
                this.fireChangeToChart(component, event, data);
            }
            else if(state === 'ERROR') {
                var errors = response.getError();
                
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message);
                    }
                }
            } else {
                console.log("state " + state);
                alert('There seems to have been an error with the callback for the filter. Please Contact your administrator, bro.');
            }
        });
        
        $A.enqueueAction(action);
    },
    fireChangeToChart : function(component, event, data)
    {
        var newObject = "";
        var findTrainingTrack = [[], [], [], [], [], [], []];
        var writeObject = "";
        
        //Gather all basic information for trainers
        for (var i = 0; i < data.length; i++) {
			
			findTrainingTrack[0][i] = data[i]["y"];
			findTrainingTrack[1][i] = data[i]["x2"];
			findTrainingTrack[2][i] = data[i]["x"];
			findTrainingTrack[3][i] = data[i]["trainerName"];
			findTrainingTrack[4][i] = data[i]["series"];
			findTrainingTrack[5][i] = data[i]["location"];
			findTrainingTrack[6][i] = data[i]["color"];
            
            //Check if PTOs or training tracks
			for (var j = 0; j < findTrainingTrack.length; j++) {
                
                //If a PTO is found for trainer
				if (findTrainingTrack[4][i] == "PTO") {
                    
                    //The following code does not execute in the "if" block, unless the trainer has a track.
                    //This code block writes a JSON array.
					if (findTrainingTrack[0][i] == findTrainingTrack[0][j] && findTrainingTrack[4][i] != findTrainingTrack[4][j]) {
						
						writeObject += "{";
						writeObject += "\"y\":";
						writeObject += findTrainingTrack[0][i];
						writeObject += ",\"x2\":";
				
						if (findTrainingTrack[1][i] == null) {
					
							writeObject += findTrainingTrack[1][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[1][i] + "\"";
						}
				
						writeObject += ",\"x\":";
				
						if (findTrainingTrack[2][i] == null) {
					
							writeObject += findTrainingTrack[2][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[2][i] + "\"";
						}
				
						writeObject += ",\"trainerName\":";
				
						if (findTrainingTrack[3][i] == null) {
					
							writeObject += findTrainingTrack[3][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[3][i] + "\"";
						}
				
						writeObject += ",\"series\":";
				
						if (findTrainingTrack[4][i] == null) {
					
							writeObject += findTrainingTrack[4][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[4][i] + "\"";
						}
				
						writeObject += ",\"location\":";
				
						if (findTrainingTrack[5][i] == null) {
					
							writeObject += findTrainingTrack[5][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[5][i] + "\"";
						}
				
						writeObject += ",\"color\":";
				
						if (findTrainingTrack[6][i] == null) {
					
							writeObject += findTrainingTrack[6][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[6][i] + "\"";
						}
				
						writeObject += "},";
					}
				} else {
                    
                    //All tracks are matched with each trainer.
					if (findTrainingTrack[0][i] == findTrainingTrack[0][j]) {
						
						writeObject += "{";
						writeObject += "\"y\":";
						writeObject += findTrainingTrack[0][i];
						writeObject += ",\"x2\":";
				
						if (findTrainingTrack[1][i] == null) {
					
							writeObject += findTrainingTrack[1][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[1][i] + "\"";
						}
				
						writeObject += ",\"x\":";
				
						if (findTrainingTrack[2][i] == null) {
					
							writeObject += findTrainingTrack[2][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[2][i] + "\"";
						}
				
						writeObject += ",\"trainerName\":";
				
						if (findTrainingTrack[3][i] == null) {
					
							writeObject += findTrainingTrack[3][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[3][i] + "\"";
						}
				
						writeObject += ",\"series\":";
				
						if (findTrainingTrack[4][i] == null) {
					
							writeObject += findTrainingTrack[4][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[4][i] + "\"";
						}
				
						writeObject += ",\"location\":";
				
						if (findTrainingTrack[5][i] == null) {
					
							writeObject += findTrainingTrack[5][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[5][i] + "\"";
						}
				
						writeObject += ",\"color\":";
				
						if (findTrainingTrack[6][i] == null) {
					
							writeObject += findTrainingTrack[6][i];
						} else {
					
							writeObject += "\"" + findTrainingTrack[6][i] + "\"";
						}
				
						writeObject += "},";
					}
				}
			}
		}
		
		writeObject += "{}";

        //The object is finished being written.
		newObject += "[" + writeObject.replace(/,{}/g, "") + "]";
        
        console.log(newObject);
        
        component.set('v.dataTemp', newObject);
        
        var UpdateChart = $A.get('e.c:UpdateChartEvent');
        
        UpdateChart.setParams({'data' : component.get('v.dataTemp')});
        UpdateChart.fire();
    }
})
