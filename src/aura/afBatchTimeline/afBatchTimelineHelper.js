({
    getNames : function(component, event)
    {
        //Calls the getTrainers function on the apex controller, returning all of the trainer names
        var action = component.get("c.getTrainers");
        action.setCallback(this, function(response){
            var state = response.getState();
            if(component.isValid() && state === 'SUCCESS')
            {
                var trainerNames = response.getReturnValue();              
                this.fireEvent(component, event, trainerNames);
                //After we get the names from the apex, we fire this event
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
        //Using the trainer names, we then fire the createJSON event to wrap the data
        var createJSON = component.getEvent("CreateJSON");
        var newJSONstring = trainerNames.toString();
        var newArray = newJSONstring.split(",");
        component.set("v.trainers", newArray);
        createJSON.setParam(
            "yAxisNames" , component.get("v.trainers")
        );
        createJSON.fire();
    },
    
    //Deprecated, the function of this was supposed to be for when new data gets sent to the chart,
    //We would just update the chart with the new data, then recreate the chart
    InitUpdate : function(component, event, names)
    {
        component.set('v.data', event.getParam('data'));
        var names = component.get('v.trainers');
        this.createChart(component, event, names);
    },
    //This is the last function to be called when creating the chart
    createChart : function(component, event, names) {
        var jsonData = component.get("v.data");
        //This variable will hold all of the data for all of the series
        var seriesObj = [];
        //parses the data we've set, so that we can work with it
        var dataObj = JSON.parse(jsonData);
        //Sometimes we're passed in the names, others this is being called from an event.
        if(names == null){
            var trainers = event.getParam("yAxisNames");
        }
        else{
            var trainers = names;
        }
        
        // seriesNames will hold all of the batch names
        var seriesNames = [];
        // Not used right now, but this could be used to only show on the y-axis the names 
        //of the trainers that appear in the data we're creating the chart with
        var trainersInData = [];
        
        for(var i = 0; i < dataObj.length; i++)
        {
            //This will create the start and end dates (x, and x2 respectively for each batch)
            var year = dataObj[i].x.substring(0,4);
            var month = dataObj[i].x.substring(5,7) - 1;
            var day = dataObj[i].x.substring(8);
            dataObj[i].x = Date.UTC(year,month,day);
            var year2 = dataObj[i].x2.substring(0,4);
            var month2 = dataObj[i].x2.substring(5,7) - 1;
            var day2 = dataObj[i].x2.substring(8);
            dataObj[i].x2 = Date.UTC(year2,month2,day2);
            //Get the name of the batch type, then remove it from the object
            var seriesName = dataObj[i].series;
            delete dataObj[i].series;
            //This is where we could do the name checking/grabbing 
            if(!trainersInData.includes(dataObj[i].trainerName)){
                 trainersInData.push(dataObj[i].trainerName);
            }
            //Then remove it from the data
            delete dataObj[i].trainerName;
            //If we already have a batch of this name, add it to the data for that series (batch)
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
            //Otherwise it's a new batch type, we'll create a new series for it
            else
            {
                seriesNames.push(seriesName);
                //You can check the highcharts api document for how to use these attributes, and what values they can be
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
        // Holds all of the data for the free times
        var freeTimeData = [];
        // Holds all of the trainers we've calculated free time for
        var trainersDone = [];
        // Loops through all of the batches we're creating the chart with
        for(var i = 0; i < dataObj.length; i++)
        {
            //If the trainer wasn't done yet, then we'll calculate free time for that trainer
            if(!trainersDone.includes(dataObj[i].y)){
                var currentTrainer = dataObj[i].y;
                trainersDone.push(currentTrainer);
                //This will hold all of the batches for the trainer
                var currentTrainerBatches = [];
                
                //Loops through all the data again (This probably is not the most optimal way to do it)
                for(var j = i; j < dataObj.length; j++)
                {
                    //If we find a batch taught by that trainer, and we haven't found this batch before, add it to our array
                    if(currentTrainer == dataObj[j].y && !currentTrainerBatches.includes(dataObj[j])){
                        currentTrainerBatches.push(dataObj[j]);
                    }
                    
                }
                //Loop through all of the batches we grabbed
                for(var k = 0 ; k < currentTrainerBatches.length ; k++){
                    //Must be more than two batches for there to be free time
                    if(currentTrainerBatches.length < 2){
                        break;
                    } else {
                        //This creates the free time itself, if the end date on the first batch is less than the start date on the second batch
                        if(currentTrainerBatches[k].x2 < currentTrainerBatches[k+1].x){
                            freeTimeData.push({'x' : currentTrainerBatches[k].x2, 'x2' : currentTrainerBatches[k+1].x, 'y' : currentTrainer, 'color' : '#FFFFFF'});
                        }
                        //If it's the last batch, there can be nothing after it (We grab it in order by start date)
                        if(k == currentTrainerBatches.length - 2){
                            break;
                        }
                    }
                }
            }      
        }
        //Creates a series called free time with the data we just created
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
            //This is setting the data for the chart to all of the data we've calculated before (with each seriesObj.push)
            series: //[ dataObj ]
            seriesObj            
        });
    },
})