({
    doInit : function(component, event, helper) {
        
        helper.setInitYear(component, event); //Sets the Initial year to be the same as the current Year. Gets years 2 years previous and one year ahead.
        helper.setInitMonth(component, event);//Sets the Initial Quarters as Q1, Q2, Q3, Q4
        helper.setLocation(component, event); //Sets the Locations that are in the database to be displayed on the checklist.
        helper.filterByChange(component, event); //Event that will Update The Chart with the 2019 (Or the current year) data.
        
    },
    
    setLocationInit : function(component, event, helper)
    {
        var ListStrings = event.getParam('listOfLocations'); //Event list of all the Locations (Due to Asynchronous Callouts)
        var Array = []; //Empty array to push data onto and set to the location options
        var Index = 0;
        for(var s = 0; s < ListStrings.length; s++) //Looping through the list of strings
        {
            Index++;
            var stringL = {'label' : ListStrings[s], 'value' : ListStrings[s]}; //Binding the name of the location with the name on the checkbox
            Array.push(stringL); //pushing the binded data
        }
        component.set('v.locationOptions', Array); //setting the values for the checkboxes
    },
    
    handleChange : function(component, event, helper)
    {
        helper.filterByChange(component, event); //deals with the change of data on the filter.
    }
})