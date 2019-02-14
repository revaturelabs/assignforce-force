({
	changeEndDate : function(component, event, helper) {

        var startDate = new Date(component.get("v.startDate"));
        var numWeeks = component.get("v.numWeeks");
        var endDate = new Date();
        component.find("endDate").set("v.disabled", false);

        if(startDate.getDay() == 0){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 4);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 1){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 3);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 2){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 2);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 3){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7) + 1);
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 4){
            endDate.setDate(startDate.getUTCDate() + (numWeeks*7));
            let year = endDate.getFullYear();
            let month = endDate.getMonth();
            let date = endDate.getDate();
            component.set("v.endDate", (year + "-" + (month+1) + "-" + date));
        } else if(startDate.getDay() == 5){ //saturday
            component.set("v.endDate", "");
            component.find("endDate").set("v.disabled", true);
        } else if(startDate.getDay() == 6){ //sunday
            component.set("v.endDate", "");
            component.find("endDate").set("v.disabled", true);
        }
        
	},
})