({
	fetchData : function(cmp, dblocation, numRecords) {
		
        var getLocationsAction = cmp.get("c.currentTrainings");        
        getLocationsAction.setParams({"status" : cmp.get("v.status")});
        
        getLocationsAction.setCallback(this, function(response){
           var state = response.getState();
            
            if (cmp.isValid() && state === "SUCCESS"){
                cmp.set("v.LocationsDB", getReturnValue());
            }
            else{
                console.log('Server call failed: ');
            }
        });
        
        $A.enqueueAction(getLocationsAction);
	},
    
})