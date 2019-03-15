({
    getNames : function(component, event)
    {
        var action = component.get("c.getTrainers");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS')
            {
                var trainerNames = response.getReturnValue();              
                this.fireEvent(component, event, trainerNames);
            }
            else if(state === 'ERROR')
            {
                alert('Name Callback has failed!');
            }
        });
        $A.enqueueAction(action);
    },
    
    fireEvent : function(component, event, trainerNames)
    {
        var createJSON = component.getEvent("CreateJSON");
        var newJSONstring = trainerNames.toString();
        var newArray = newJSONstring.split(",");
        component.set("v.trainers", newArray);
        createJSON.setParam(
            "yAxisNames" , component.get("v.trainers")
        );
        createJSON.fire();
    },
    
    InitUpdate : function(component, event, names)
    {
        component.set('v.data', event.getParam('data'));
        var names = component.get('v.trainers');
        this.createChart(component, event, names);
    },
    createChart : function(component, event, names) {
        var jsonData = component.get("v.data");
        var seriesObj = [];
        var dataObj = JSON.parse(jsonData);
        if(names == null){
            var trainers = event.getParam("yAxisNames");
        }
        else{
            var trainers = names;
        }
        var trainerAssignment = [];
        
        var seriesNames = [];
        var seriesData = [];
        var freeTimeData = [];
        var trainersInData = [];
        for(var i = 0; i < dataObj.length; i++)
        {
            var year = dataObj[i].x.substring(0,4);
            var month = dataObj[i].x.substring(5,7) - 1;
            var day = dataObj[i].x.substring(8);
            dataObj[i].x = Date.UTC(year,month,day);
            var year2 = dataObj[i].x2.substring(0,4);
            var month2 = dataObj[i].x2.substring(5,7) - 1;
            var day2 = dataObj[i].x2.substring(8);
            dataObj[i].x2 = Date.UTC(year2,month2,day2);
            var seriesName = dataObj[i].series;
            delete dataObj[i].series;
            if(!trainersInData.includes(dataObj[i].trainerName)){
                 trainersInData.push(dataObj[i].trainerName);
			}
            delete dataObj[i].trainerName;
            if(seriesNames.includes(seriesName))
            {
                for(var c = 0; c < seriesObj.length; c++)
                {
                    if(seriesObj[c].name == seriesName)
                    {
                        seriesObj[c].data.push ({'x' : dataObj[i].x, 'x2' : dataObj[i].x2, 'y' : dataObj[i].y, 'color' : dataObj[i].color});
                    }
                }
            }
            else
            {
                seriesNames.push(seriesName);
                seriesData.push(dataObj[i]);
                seriesObj.push({'name' : seriesName, 'pointWidth' : 30,  'data' : [{'x' : dataObj[i].x, 'x2' : dataObj[i].x2, 'y' : dataObj[i].y, 'color' : dataObj[i].color}], 'dataLabels': {
                    enabled: true,
                    style:
                    {
                        fontSize : '17px',
                        fontFamily : 'Futura-Std-Bold',
                        textAlign : 'center',
                        color : 'white',
                        textOutline : false,
                        
                    },
                    formatter: function(){
                        return Math.ceil((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) + " Weeks";
                    }
                }
                               });
            }//end of Else 
            
            
        }
        var freeTimeData = [];
        var trainersDone = [];
        for(var i = 0; i < dataObj.length; i++)
        {
            if(!trainersDone.includes(dataObj[i].y)){
                var currentTrainer = dataObj[i].y;
                trainersDone.push(currentTrainer);
                var currentTrainerBatches = [];
                //var currentTrainerFreeTime = [];
                for(var j = i; j < dataObj.length; j++)
                {
                    if(currentTrainer == dataObj[j].y && !currentTrainerBatches.includes(dataObj[j])){
                        currentTrainerBatches.push(dataObj[j]);
                    }
                    
                }
                for(var k = 0 ; k < currentTrainerBatches.length ; k++){
                    if(currentTrainerBatches.length < 2){
                        break;
                    } else {
                        
                        if(currentTrainerBatches[k].x2 < currentTrainerBatches[k+1].x){
                            freeTimeData.push({'x' : currentTrainerBatches[k].x2, 'x2' : currentTrainerBatches[k+1].x, 'y' : currentTrainer, 'color' : '#FFFFFF'});
                        }
                        if(k == currentTrainerBatches.length - 2){
                            break;
                        }
                    }
                }
            }      
        }
        
        seriesObj.push({'name' : 'Free Time', 'pointWidth' : 30, 'data' : freeTimeData, 'fill' : '#FFFFFF', 'dataLabels' : {
            enabled : true,
            style:
            {
                fontSize : '17px',
                fontFamily : 'Futura-Std-Bold',
                textAlign : 'center',
                color : 'black',
                textOutline : false,
            },
            formatter: function(){
                return Math.ceil((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000))  + " Weeks";
            }
        }
                       });
        //var colorTheme = new Highcharts.setOptions({colors : ['#F26925', '#474C55', '#72A4C2', '#FCB414', '#B9B9BA']});
        
        var charts = new Highcharts.chart({
            chart: {
                renderTo: component.find("container").getElement(),
                type: 'xrange'
            },
            title: {
                text : component.get('v.chartTitle'),
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    style:
                    {
                        fontSize : '16px',
                        fontFamily : 'Futura-Std-Book'
                    }
                }
            },
            yAxis: {
                title:{
                    text: '',
                },
                labels: {
                    style:
                    {
                        fontSize : '14px',
                        fontFamily : 'Futura-Std-Book',
                        wordWrap : 'break-word',
                        width: '30px'
                        
                    }
                },
                categories: trainers,
                reversed : true,
                
            },
            plotOptions: {
                series: {
               //     stacking: 'normal' (If this is enabled, the bars will be in one straight line in the middle, however if 
               //     						two trainers have batches starting the same week, it will move one of them down)
                },
               
            },
            series: //[ dataObj ]
            seriesObj            
        });
    },
})