({
	/*helperMethod : function() {
		
	}*/
    
    getRoomList: function(component) {
        var getRooms = component.get('c.getRooms');
        // Set up the callback
        getRooms.setCallback(this, function(response) {
            var state = response.getState();
            
            if(component.isValid && state === 'SUCCESS'){
                console.log('Getting cases');
                console.log('cases: ' + response.getReturnValue());
                
                component.set("v.rooms", response.getReturnValue());
            }else if(state === 'ERROR'){
                var errors = response.getError();
                
                if(errors){
                    if(errors[0] && errors[0].message){
                        console.log('Error message: ' + errors[0].message);
                    }
                }
            }else{
                console.log('Unknown error');
            }
        });
        $A.enqueueAction(getRooms);
      }        
})