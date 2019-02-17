({
	doInit : function(component, event, helper) {
        
		helper.setInitYear(component, event);
        helper.setInitMonth(component, event);
        helper.setLocation(component, event);

	},
    
    setLocationInit : function(component, event, helper)
    {
       var ListStrings = event.getParam('listOfLocations');
       var Array = [];
       var Index = 0;
        for(var s = 0; s < ListStrings.length; s++)
        {
            Index++;
            var stringL = {'label' : ListStrings[s], 'value' : ListStrings[s]};
            console.log('submitted value: ' + JSON.stringify(stringL));
            Array.push(stringL);
        }
        component.set('v.locationOptions', Array);
	},
    
    handleChange : function(component, event, helper)
    {
        console.log('I have been called');
		helper.filterByChange(component, event);
    }
})