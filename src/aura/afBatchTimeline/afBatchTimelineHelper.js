({
	helperMethod : function(component, event, helper) {
        var jsonData = component.get("v.data");
        console.log('here');
        var dataObj = JSON.parse(jsonData);
        console.log(dataObj);
        var year = dataObj[0].x.substring(0,4);
        var month = dataObj[0].x.substring(5,7);
        var day = dataObj[0].x.substring(8);
        	dataObj[0].x = Date.UTC(year,month,day);
                var year2 = dataObj[0].x2.substring(0,4);
        var month2 = dataObj[0].x2.substring(5,7);
        var day2 = dataObj[0].x2.substring(8);
        dataObj[0].x2 = Date.UTC(year2,month2,day2);
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
      min: 0,
    title: {
      text: //component.get('v.yAxisNames'),
      'Jeremiah Rodriguez',
    },
    //categories: ['Jeremiah Rodriguez'],
    //reversed: true
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
       console.log('here');
	}
})