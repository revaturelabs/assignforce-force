({
    setInitYear : function(component, event)
    {
        var today = new Date();
        var year = today.getFullYear();
        var choices = {		//this creates the filterable set of years dynamically.
            selectedYearId: 2,
            years: [
                {id: 1, label: year + 1},
                { id: 2, label: year, selected: true},
                { id: 3, label: year - 1},
                { id: 4, label: year - 2 },
                {id: 5, label: 'All'}
            ]
        };
        component.set('v.yearOptions', choices.years); //sets the year Options
        component.set('v.selectedYear', choices.selectedYearId); // sets the selected year to the current year.
    },
    
    setInitMonth : function(component, event)
    {
        var quarters = ['Choose one...','Q1', 'Q2', 'Q3', 'Q4']; //Quarter filters. each quarter is a 3-month span
        
        var choices = {
            selectedQuarterId: 1, //Selects the Choose one... as the first option in the chart.
            quarter: [
                { id: 1, label: quarters[0], selected: true },
                { id: 2, label: quarters[1]},
                { id: 3, label: quarters[2]},
                { id: 4, label: quarters[3]},
                { id: 5, label: quarters[4]}
            ]
        };
        component.set('v.quarterOptions', choices.quarter); //sets the quarter options
        component.set('v.selectedQuarter', choices.selectedQuarterId); //sets the selected quarter
    },
    
    setLocation : function(component, event) 
    {
        var action = component.get('c.getTrainingLocations'); //gets the getTrainingLocations from the apex controller
        
        action.setCallback(this, function(response){ //callback to get Location data from the database
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS')
            {
                var Locations = response.getReturnValue();
                this.fireLocationEvent(component, event, Locations); //fire the event when the location info has been recieved.
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
        component.set('v.AllLocations', NoDupesArray); //adds the locations to the attibute without duplicates.
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
        
        component.set('v.selectedLocations', changeValue); // this sets the selected locations
        var Locations = component.get('v.selectedLocations');
        if(component.get('v.selectedQuarter') != 1 && changeValue.length != 0)
        {
            action = component.get('c.filterTrainingsByYearLocationQuarter'); //filter by all 3 (location, year, and quarter)
            action.setParams({
                'location' : Locations,
                'year' : component.get('v.selectedYear'),
                'quarter' : component.get('v.selectedQuarter')
            });
        }
        else if(changeValue.length != 0 && component.get('v.selectedQuarter') == 1) //filter by 2
        {
            action = component.get('c.filterTrainingsByYearLocation');
            action.setParams({
                'location' : Locations,
                'year' : component.get('v.selectedYear')
            });
        }
            else if(component.get('v.selectedQuarter') != 1) //filter by 2
            {
                action = component.get('c.filterTrainingsByYearQuarter');
                action.setParams({
                    'year' : component.get('v.selectedYear'),
                    'quarter' : component.get('v.selectedQuarter')
                });
            }
                else
                {
                    action = component.get('c.filterTrainingsByYear'); //filter by 1
                    action.setParams({
                        'year' : component.get('v.selectedYear')
                    });
                }
       // console.log("action: " + JSON.stringify(action));
        action.setCallback(this, function(response){
            var state = response.getState();
            if(/*component.isValid() &&*/ state === 'SUCCESS')
            {
                var data = response.getReturnValue();
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
        component.set('v.dataTemp', data);
        var UpdateChart = $A.get('e.c:UpdateChartEvent');
        UpdateChart.setParams({'data' : component.get('v.dataTemp')});
        UpdateChart.fire();
    },
})