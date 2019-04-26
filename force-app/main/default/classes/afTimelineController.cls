public class afTimelineController {
    
    public class TrainingDataWrapper {
        @AuraEnabled
        public Integer y; //y-coordinate for the chart
        @AuraEnabled
        public Date x; //beginning coordinate of x-range
        @AuraEnabled
        public Date x2; //ending coordinate of x-range
        @AuraEnabled
        public String series; //'series' represents the name of the Training Track, these can be seen as radio buttons at the bottom of the graph
        @AuraEnabled
        public String color;
        @AuraEnabled
        public String trainerName;
        @AuraEnabled
        public String location;


    }
    /*  PROPERTIES
            List<Training__c> AllTrainings
            List<Training__c> currentTrainings
            List<User> trainers
            List<PTO__c> approvedPTOs
            List<PTO__c> currentPTOs
    */
    public static List<Training__c> AllTrainings {
        get{
            if(AllTrainings == null) {
                AllTrainings = [SELECT Id, Name, TrainingLocation__c, Trainer__r.Name, StartDate__c, 
                                TrainingLocation__r.OfficeName__c, EndDate__c, 
                                CoTrainer__r.name, TrainingTrack__r.ShortName__c,
                                TrainingTrack__r.Color__c,
                                TrainingClass__c FROM Training__c ORDER BY Trainer__r.Name, StartDate__c];
            }
            
            return AllTrainings;
        }
        set;
    }
    
    public static List<Training__c> currentTrainings { //AllTrainings is assigned here to cut down on DML/SOQL statements
        get{
            if(currentTrainings == null) {  
                currentTrainings = AllTrainings;
            }

            return currentTrainings;
        }
        set;
    }
    
    public static List<User> trainers {
        get {
            if(trainers == null){
                trainers =  [SELECT Name 
                             FROM User 
                             WHERE UserRole.Name = 'Trainer'
                             ORDER BY Name];
            }

            return trainers;
        }
        set;
    } 

    public static List<PTO__c> approvedPTOs {
        get{
            if (approvedPTOs == null) {
                approvedPTOs = [SELECT StartDate__c, EndDate__c, Trainer__c, Status__c, Trainer__r.CurrentLocation__c, Trainer__r.Name
                                FROM PTO__c
                                WHERE Status__c = 'Approved'];
            }
            return approvedPTOs;
        }
        set;
    }

    public static List<PTO__c> currentPTOs {
        get{
            if (currentPTOs == null) {
                currentPTOs = approvedPTOs;
            }
            return currentPTOs;
        }
        set;
    }
    
    @AuraEnabled
    public static String[] getTrainingLocations() {

        String[] officeLocations = new String[]{};

        for(Training__c t : AllTrainings) {
            officeLocations.add(t.TrainingLocation__r.OfficeName__c);
        }

        return officeLocations;
    }
    
    //END PROPERTIES

    @AuraEnabled
    public static String[] getTrainers() {

        String[] trainerNames = new String[]{};
        List<String> trainerUsers = new List<String>();         
		
        /*
        for(User u : trainers) { 

            // Boolean trainerInTrainings = false;

            for(Training__c t : currentTrainings) {   
                if(u.Name == t.Trainer__r.Name){
                    // trainerInTrainings = true;
                    trainerNames.add(u.Name);
                    break;
                } 
                if (t.External_Trainer__c != null){
                    trainerNames.add(t.External_Trainer__r.Name);
            	}
        	} 	
        } */
            
        for(Training__c t : currentTrainings) {   
                if(t.Trainer__c != null){
                    trainerNames.add(t.Trainer__r.Name);
                } else if (t.External_Trainer__c != null){
                    trainerNames.add(t.External_Trainer__r.Name);
            	}
        	}
        
        return trainerNames;
    }
    /*
        This is a completely rewritten method to replace createTrainingJSON(), which was Batch 1 legacy code.

        @author     022519Salesforce
        @author     Matthew Wright
        @return     a complete JSON of Trainings, PTOs, and Free Time, each assigned to a particular trainer on the Y-axis.
        @todo       seperate this method's logical components, for brevity.
    */

    @AuraEnabled
    public static string createTrainingJSON(){

        List<TrainingDataWrapper> trainingDataList = new List<TrainingDataWrapper>();
        Map<Integer,String> trainerMap = new Map<Integer,String>(); //map of {Trainer Y-coordinate, Trainer Name}

        /* TRAINING LOGIC STARTS */
        // Add all trainings to the dataset
        for(Training__c currTraining : currentTrainings) { //iterate over the list of current trainers/batches (Sorted by year/location/etc.)
            TrainingDataWrapper currTDW = new TrainingDataWrapper(); //Represents the current Training

            // Account for the first time through, when the Trainer Map is empty
            if(trainerMap.isEmpty()){
                trainerMap.put(0,currTraining.Trainer__r.Name);
            }
            else {
                //iterate over the Trainer Map
                for(Integer y = 0; y < trainerMap.size(); y++) {
                    //Check if current Trainer is already referenced in the Map
                    if(trainerMap.get(y) == currTraining.Trainer__r.Name) { 
                        // Set the values of the map to the TDW object
                        currTDW.y = y;
                        currTDW.trainerName = trainerMap.get(y);
                        break;
                    } 
                    //check if the for loop is at the end of the Map, meaning the trainer is not referenced yet.
                    //set the trainer's value in the map, also in the TDW object
                    else if(trainerMap.containsKey(y + 1) == null){
                        trainerMap.put(y + 1,currTraining.Trainer__r.Name);
                        currTDW.y = y + 1;
                        currTDW.trainerName = trainerMap.get(y + 1);
                        break;
                    }
                } 
            }
        
            //set attributes of TrainingDataWrapper, y is already set
            currTDW.x = currTraining.StartDate__c;
            currTDW.x2 = currTraining.EndDate__c;
            currTDW.series = currTraining.TrainingTrack__r.ShortName__c;
            currTDW.location = currTraining.TrainingLocation__r.OfficeName__c;
            currTDW.color = currTraining.TrainingTrack__r.Color__c;
            trainingDataList.add(currTDW);

    }   // END TRAINING ITERATOR FOR LOOP
		/* TRAINING LOGIC ENDS */	

        /* PTO LOGIC STARTS */

        // Add all PTO to the dataset
        for(PTO__c currPTO : currentPTOs) { //iterate over the list of current approved PTO requests
            TrainingDataWrapper currTDW = new TrainingDataWrapper(); //Represents the current PTO request, in this context

            // Check if trainerMap is empty.
            // PTO shouldn't draw if the trainer doesnt have at least one branch on the timeline
            if(!trainerMap.isEmpty()){
                //iterate over the Trainer Map
                for(Integer y = 0; y < trainerMap.size(); y++) {
                    //Check if current Trainer is already referenced in the Map
                    // PTO shouldn't draw if the trainer doesnt have at least one branch on the timeline
                    if(trainerMap.get(y) == currPTO.Trainer__r.Name) { 
                        // Set the values of the map to the TDW object
                        currTDW.y = y;
                        currTDW.trainerName = trainerMap.get(y);
                        break;
                    } 
                   
                } 
            }
            
            //set attributes of TrainingDataWrapper, y is already set
            currTDW.x = currPTO.StartDate__c;
            currTDW.x2 = currPTO.EndDate__c;
            currTDW.series = 'PTO';
            currTDW.location = 'PTO';
            currTDW.color = 'Gray';
            trainingDataList.add(currTDW);

        } //END PTO ITERATOR FOR LOOP

        /* PTO LOGIC ENDS */

        /* FREE TIME LOGIC BEGINS */

        /* FREE TIME LOGIC ENDS */


        
        
        System.debug('trainingDataList (serialized): ' + System.json.serialize(trainingDataList));
        return System.json.serialize(trainingDataList); 
 
    }//END createTrainingJSON()

   
    @AuraEnabled
    public static String filterTrainingsByYearLocationQuarter(String[] location, Integer year, Integer quarter) {

        Integer convertedYear = convertYear(year);
        List<Integer> monthList = convertQuarter(quarter);
        
        List<Training__c> NewTrainings = new List<Training__c>();

        for(Training__c t : allTrainings) {

            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            
            for(String s : location) {
                if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == trainingYear && monthList.contains(trainingMonth)) {
                    NewTrainings.add(t);
                }
                else if(t.TrainingLocation__r.OfficeName__c == s && monthList.contains(trainingMonth) && convertedYear == null) {
                    NewTrainings.add(t);
                }
            }
        } 

        currentTrainings = NewTrainings;

        List<PTO__c> newPTOs = new List<PTO__c>();

        for (PTO__c pto : approvedPTOs) {
            Integer PTOYear = pto.StartDate__c.year();
            Integer PTOMonth = pto.StartDate__c.month();
            String PTOLoc = pto.Trainer__r.CurrentLocation__c;
            if(location.contains(PTOLoc) && monthList.contains(PTOMonth) && convertedYear == PTOYear) {
                newPTOs.add(pto);
            } else if (location.contains(PTOLoc) && monthList.contains(PTOMonth) && convertedYear == null) {
                newPTOs.add(pto);
            }
        }

        currentPTOs = newPTOs;
        
        return createTrainingJSON();
    }
    
    @AuraEnabled
    public static String filterTrainingsByYearLocation(String[] location, Integer year) {

        Integer convertedYear = convertYear(year);
        
        List<Training__c> NewTrainings = new List<Training__c>();

        for(Training__c t : allTrainings) {
            Integer trainingYear = t.StartDate__c.year();
            
            for(String s : Location) {
                if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == trainingYear ) {
                    NewTrainings.add(t);
                }
                else if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == null) {
                    NewTrainings.add(t);
                }
            }
        }

        currentTrainings = NewTrainings;

        List<PTO__c> newPTOs = new List<PTO__c>();

        for (PTO__c pto : approvedPTOs) {
            Integer PTOYear = pto.StartDate__c.year();
            String PTOLoc = pto.Trainer__r.CurrentLocation__c;
            if(location.contains(PTOLoc) && convertedYear == PTOYear) {
                newPTOs.add(pto);
            } else if (location.contains(PTOLoc) && convertedYear == null) {
                newPTOs.add(pto);
            }
        }

        currentPTOs = newPTOs;
        
        return createTrainingJSON();
    }
    
    
    @AuraEnabled
    public static String filterTrainingsByYearQuarter(Integer year, Integer quarter) {

        List<Integer> monthList = convertQuarter(quarter); 
        Integer convertedYear = convertYear(year);
        
        List<Training__c> NewTrainings = new List<Training__c>();

        for(Training__c t : allTrainings) {

            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            
            if(convertedYear == trainingYear && monthList.contains(trainingMonth)) {
                NewTrainings.add(t);
            }
            else if(monthList.contains(trainingMonth) && convertedYear == null) {
                NewTrainings.add(t);
            }
        }

        currentTrainings = NewTrainings;

        List<PTO__c> newPTOs = new List<PTO__c>();

        for (PTO__c pto : approvedPTOs) {

            Integer PTOYear = pto.StartDate__c.year();
            Integer PTOMonth = pto.StartDate__c.month();

            if(convertedYear == PTOYear && monthList.contains(PTOMonth)) {
                newPTOs.add(pto);
            } else if (monthList.contains(PTOMonth) && convertedYear == null) {
                newPTOs.add(pto);
            }
        }

        currentPTOs = newPTOs;
        
        return createTrainingJSON();
    }
    
    @AuraEnabled
    public static String filterTrainingsByYear(Integer year) {
        
        Integer convertedYear = convertYear(year);

        List<Training__c> NewTrainings = new List<Training__c>();
        
        for(Training__c t : allTrainings) {

            Integer trainingYear = t.StartDate__c.year();
            
            if(convertedYear == trainingYear ) {
                NewTrainings.add(t);
            }
            else if(convertedYear == null) {
                NewTrainings.add(t);
            }
        }
        
        currentTrainings = NewTrainings;

        List<PTO__c> newPTOs = new List<PTO__c>();
        
        for (PTO__c pto : approvedPTOs) {

            Integer PTOYear = pto.StartDate__c.year();

            if(convertedYear == PTOYear) {
                newPTOs.add(pto);
            } else if (convertedYear == null) {
                newPTOs.add(pto);
            }
        }
        
        currentPTOs = newPTOs;
        
        return createTrainingJSON();
    }
    
    /*
        Takes the value from the dropdown picklist and make it into the selected year.

        @param yearCode         Integer 1-5, which relates to the picklist component on the timeline 
        @return convertedYear   An integer representing the selected 4-digit year.
    */
    
    @testVisible
    private static Integer convertYear(Integer yearCode) {

        Integer convertedYear = 0;
        
        switch on(yearCode) {
            when 1 {
                convertedYear = Date.today().year() + 1;
            }
            when 2 {
                convertedYear = Date.today().year();
            }
            
            when 3 {
                convertedYear = Date.today().year() - 1;
            }
            when 4 {
                convertedYear = Date.today().year() - 2;
            }
            when 5 {
                convertedYear = null;
            }
            when else {
                return null;
            }
        }

        return convertedYear;
    }
    
        /*
        Takes the value from the dropdown picklist and make it into the selected year.

        @param quarterCode  Integer 2-5, which relates to the picklist component on the timeline 
        @return monthList   A List<Integer> representing the months of the selected quarter.
    */
    @testVisible
    private static List<Integer> convertQuarter(Integer quarterCode) {

        List<Integer> monthList = new List<Integer>();

        switch on(quarterCode) {
            when 2 {
                monthList.add(01);
                monthList.add(02);
                monthList.add(03);
            }
            when 3 {
                monthList.add(04);
                monthList.add(05);
                monthList.add(06);
            }
            when 4 {
                monthList.add(07);
                monthList.add(08);
                monthList.add(09);
            }
            when 5 {
                monthList.add(10);
                monthList.add(11);
                monthList.add(12);
            }
            when else {
                return null;
            }
        }

        return monthList;
    }
    
}