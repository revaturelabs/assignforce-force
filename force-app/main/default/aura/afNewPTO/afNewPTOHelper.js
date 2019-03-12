({
	clear : function(component, event) {   
        
        component.set("v.uncleared", false);
        component.set("v.uncleared", true);
        component.set("v.startDate",null);
        component.set("v.endDate",null);
        component.set("v.reason","");
    }
})