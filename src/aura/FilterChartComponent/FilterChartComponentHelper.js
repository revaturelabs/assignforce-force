({
    setInitYear : function(component, event)
    {
        var today = new Date();
        var year = today.getFullYear();
        var choices = {
            selectedYearId: 1,
            years: [
                { id: 1, label: year, selected: true },
                { id: 2, label: year - 1},
                { id: 3, label: year - 2 }
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
                { id: 4, label: quarters[4]}
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
                console.log('Locations ' + Locations);
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
        console.log('NewArray ' + newArray);
        component.set('v.AllLocations', newArray);
        console.log('All Locations ' + component.get('v.AllLocations'));
        getLocation.setParam(
            "listOfLocations" , component.get('v.AllLocations')
        );
        console.log('listOfLocations ' + getLocation.getParam('listOfLocations'));
        getLocation.fire();
    },
    
    filterByChange : function(component, event)
    {
    var changeValue = component.get('v.value');//event.getParam("value");
        if(changeValue == undefined)
        {
            changeValue = [];
        }
        console.log('value ' + changeValue);
        console.log('length: ' + changeValue.length);
        console.log('selectedQuarter: ' + component.get('v.selectedQuarter'));
    var action; 
    
    component.set('v.selectedLocations', changeValue);
    var Locations = component.get('v.selectedLocations');
        console.log('Locations: ' + Locations);
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
    console.log('I made it here');
    action.setParams({
        'location' : Locations,
        'year' : component.get('v.selectedYear')
    });
    console.log('I am here now');
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
action.setCallback(this, function(response){
    var state = response.getState();
    if(component.isValid() && state === 'SUCCESS')
    {
        var data = response.getReturnValue();
        this.fireChangeToChart(component, event, data);
    }
    else
    {
        alert('There seems to have been an error with the callback for the filter. Please Contact your administrator.');
    }
});
        $A.enqueueAction(action);
},
fireChangeToChart : function(component, event, data)
{
    console.log('FIRE!');
    component.set('v.dataTemp', data);
    var UpdateChart = $A.get('e.c:UpdateChartEvent');
    UpdateChart.setParams({'data' : component.get('v.dataTemp')});
   UpdateChart.fire();
},
})