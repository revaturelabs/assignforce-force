({
    doInit : function(component, event, helper) {
        var Externaltrainers    = [];
        //This variable is assigned the list of External Trainers from the Apex Controller
        var trnrAction     = component.get("c.allTrainers");
 
        //setCallbacj runs when the remote method call returns.
        //For more information on callbacks, see this Unit https://trailhead.salesforce.com/en/content/learn/modules/lex_dev_lc_basics/lex_dev_lc_basics_server
        trnrAction.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.extTrainers", response.getReturnValue());
             
            } else if (state === "ERROR"){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log('Error message: ' + errors[0].message);
                    }
                }
            } else {
                console.log('Function callback error. Function call failed. {0120}');
            }
        })
        $A.enqueueAction(trnrAction);
    },
 
 
 })