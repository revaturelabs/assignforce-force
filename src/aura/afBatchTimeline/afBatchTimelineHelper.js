({
    getNames : function(component, event)
    {
        console.log('I have entered get names');
        var action = component.get("c.getTrainers");
        console.log('after action');
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS')
            {
                console.log('get names success');
                var trainerNames = response.getReturnValue();              
                this.fireEvent(component, event, trainerNames);
            }
            else if(state === 'ERROR')
            {
                console.log('Name Callback has failed!');
            }
        });
        $A.enqueueAction(action);
    },
    
    fireEvent : function(component, event, trainerNames)
    {
        console.log('Firing event');
        var createJSON = component.getEvent("CreateJSON");
        var newJSONstring = trainerNames.toString();
        var newArray = newJSONstring.split(",");
        component.set("v.trainers", newArray);
        console.log('v.trainers: ' + component.get("v.trainers"));
        createJSON.setParam(
            "yAxisNames" , component.get("v.trainers")
        );
        console.log('event params fireEvent ' + createJSON.getParam('yAxisNames'));
        createJSON.fire();
	},
    createChart : function(component, event) {
        var jsonData = component.get("v.data");
        var dataObj = JSON.parse(jsonData);
        var trainers = event.getParam("yAxisNames");
        console.log('Trainers ' + trainers);
        var trainerAssignment = [];

        for(var i = 0; i < dataObj.length; i++)
        {
            var year = dataObj[i].x.substring(0,4);
            var month = dataObj[i].x.substring(5,7) - 1;
            var day = dataObj[i].x.substring(8);
            console.log('StartMonth ' + month);
            dataObj[i].x = Date.UTC(year,month,day);
            var year2 = dataObj[i].x2.substring(0,4);
            var month2 = dataObj[i].x2.substring(5,7) - 1;
            var day2 = dataObj[i].x2.substring(8);
            console.log('EndMonth ' + month2);
            dataObj[i].x2 = Date.UTC(year2,month2,day2);
        }
        console.log('trainerAssignment: ' + trainerAssignment);
        
        var charts = new Highcharts.chart({
            chart: {
                renderTo: component.find("container").getElement(),
                type: 'xrange'
            },
            title: {
                text : component.get('v.chartTitle'),
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                
                title: {
                text: ''
                
                },
                categories: trainers,
                reversed : true,
                
            },
            series: [{
                name: 'Batches',
                // pointPadding: 0,
                // groupPadding: 0,
                borderColor: 'gray',
                pointWidth: 20,
                data: dataObj,
                dataLabels: {
                    enabled: true,
                    formatter : function(){
                    return Math.ceil((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000))  + " weeks";
                }
                }
            }]
            
        });
    },
})