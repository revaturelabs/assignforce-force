({
    //gets the trainers for data from apex controller
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
        var dataObj = JSON.parse(jsonData); // parsed JSON from component
        var seriesObj = []; // The Data what will be used to make the chart

        if(names == null){
            var trainers = event.getParam("yAxisNames");
        }
        else{
            var trainers = names;
        }
        var trainerAssignment = [];   
        var seriesNames = []; // Names of the series (Training Tracks) that are being referenced in the graph
        var seriesData = []; // certain dataObj fields are pushed to this list
        var freeTimeData = [];
        var trainersInData = []; // Trainers that are to be referenced in the graph


        //Create the variables for sizing the bars in the graph
        for(var i = 0; i < dataObj.length; i++) {
            //Dates made from parsed JSON string, broken into substrings
            var year = dataObj[i].x.substring(0,4);
            var month = dataObj[i].x.substring(5,7) - 1;
            var day = dataObj[i].x.substring(8);
            dataObj[i].x = Date.UTC(year,month,day);
            var year2 = dataObj[i].x2.substring(0,4);
            var month2 = dataObj[i].x2.substring(5,7) - 1;
            var day2 = dataObj[i].x2.substring(8);
            dataObj[i].x2 = Date.UTC(year2,month2,day2);
            //Sets series name using JSON "series" field
            var seriesName = dataObj[i].series;
            delete dataObj[i].series;

            //Adds trainer to list
            if(!trainersInData.includes(dataObj[i].trainerName)){
                 trainersInData.push(dataObj[i].trainerName);
			}
            delete dataObj[i].trainerName;

            //The creation of the bars for the training tracks
            if(seriesNames.includes(seriesName)) //seriesNames default is null, so this doesn't fire the first time.
            {
                for(var c = 0; c < seriesObj.length; c++)
                {
                    if(seriesObj[c].name == seriesName)
                    {
                        
                        seriesObj[c].data.push ({'x' : dataObj[i].x, 'x2' : dataObj[i].x2, 'y' : dataObj[i].y, 'color' : dataObj[i].color});
                    }
                }
            }
            else // adds the current seriesName to the seriesNames list, if it isn't already in the list.
            {
                seriesNames.push(seriesName);
                seriesData.push(dataObj[i]);
                seriesObj.push({'name' : seriesName, 'pointWidth' : 30, 'data' : [{'x' : dataObj[i].x, 'x2' : dataObj[i].x2, 'y' : dataObj[i].y, 'color' : dataObj[i].color}], 'dataLabels': {
                    enabled: true,
                    style:
                    {
                        fontSize : '14px',
                        fontFamily : 'Futura-Std-Bold',
                        textAlign : 'center',
                        color : 'white', 
                        textOutline : false,
                        
                    },
                    //Displays the number of weeks for how long the training tracks are
                    formatter: function(){
                        if (Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) > 0) {
                            if (Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) == 1) {
                                return Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) + " Week";
                            }
                            return Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) + " Weeks";
                        }
                        return "";
                    }
                }
                               });
            }//end of the Else 

        }
        
        //Creating the bars, but for the free time(time inbetween batches)
        var freeTimeData = [];
        var trainersDone = [];
        for(var i = 0; i < dataObj.length; i++)
        {
            if(!trainersDone.includes(dataObj[i].y)){
                var currentTrainer = dataObj[i].y;
                trainersDone.push(currentTrainer);
                var currentTrainerBatches = [];
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
        } //END FOR
        
        

        seriesObj.push({'name' : 'Free Time', 'pointWidth' : 30, 'data' : freeTimeData, 'fill' : '#ffffff', 'dataLabels' : {
            enabled : true,
            style:
            {
                fontSize : '14px',
                fontFamily : 'Futura-Std-Bold',
                textAlign : 'center',
                color : 'black',
                textOutline : false,
            },
            formatter: function(){
                if (Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) > 0) {
                    if (Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) == 1) {
                        return Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) + " Week";
                    }
                    return Math.floor((this.x2 - this.x) / (7 * 24 * 60 * 60 * 1000)) + " Weeks";
                }
                return "";
            }
        }
        
                       });
        
        //The formatting for the chart
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
                    minPointLength: 50
                },
                //Pls don't delete this, took us 1.5 weeks to figure this out :)
                xrange: {
                    groupPadding: .5
                }
            },
            series: seriesObj     
        });
    },
})