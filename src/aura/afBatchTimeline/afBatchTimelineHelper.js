({
    createChart : function(component, event) {
        var jsonData = component.get("v.data");
        var dataObj = JSON.parse(jsonData);
        var trainers = component.get("v.yAxisNames");
        var trainerAssignment = [];

        for(var i = 0; i < dataObj.length; i++)
        {
            for(var j = 0; j < trainers.length; j++)
            {
                if(j == dataObj[i].y)
                {
                    trainerAssignment.push(trainers[j]);
                }
            }
            var year = dataObj[i].x.substring(0,4);
            var month = dataObj[i].x.substring(5,7);
            var day = dataObj[i].x.substring(8);
            dataObj[i].x = Date.UTC(year,month,day);
            var year2 = dataObj[i].x2.substring(0,4);
            var month2 = dataObj[i].x2.substring(5,7);
            var day2 = dataObj[i].x2.substring(8);
            dataObj[i].x2 = Date.UTC(year2,month2,day2);
        }
        console.log('trainerAssignment: ' + trainerAssignment);
        
        var charts = new Highcharts.chart({
            chart: {
                renderTo:component.find("container").getElement(),
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
                categories: trainerAssignment,
                reversed: true
            },
            series: [{
                name: 'Project 1',
                // pointPadding: 0,
                // groupPadding: 0,
                borderColor: 'gray',
                pointWidth: 20,
                data: dataObj,
                dataLabels: {
                    enabled: true
                }
            }]
            
        });
    },
    
    getNames : function(component, event)
    {
        console.log('I have entered get names');
        var action = component.get("c.getTrainers");
        console.log('after action');
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS')
            {
                var trainerNames = response.getReturnValue();              
                component.set("v.yAxisNames", trainerNames);
                console.log("yAxisNames: " + component.get('v.yAxisNames'));
            }
            else if(state === 'ERROR')
            {
                console.log('Name Callback has failed!');
            }
        });
        $A.enqueueAction(action);
    }
})