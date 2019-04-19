public class afTimelineController {
    
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
    
    public static List<Training__c> currentTrainings {
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
    
    @AuraEnabled
    public static String[] getTrainers() {

        String[] trainerNames = new String[]{};

        for(User u : trainers) { 

            Boolean trainerInTrainings = false;

            for(Training__c t : currentTrainings) {   
                if(u.Name == t.Trainer__r.Name){
                    trainerInTrainings = true;
                    trainerNames.add(u.Name);
                    break;
                } 
            }
        }

        return trainerNames;
    }
    
    @AuraEnabled
    public static String wrapTrainingToJSON() {
        List<TrainingDataWrapper> trainerData = new List<TrainingDataWrapper>();
        Map<Integer,String> trainerNumbersNames = new Map<Integer,String>();
        List<String> trainerNames = new List<String>();

        // trainerNumber represents the position on the Y-Axis (timeline chart) 
        Integer trainerNumber = 0;
        Integer trainerIndex = 0;
        Integer j = 0;

        // Add all trainings to the dataset
        for(Training__c t : currentTrainings) {
            Boolean trainerInMap = false;
            TrainingDataWrapper tdw = new TrainingDataWrapper();

            // Loop will not run the first time through, but the code
            // after the loop exits will add to the List
            for(j = 0 ; j < trainerNames.size() ; j++) {
                if(trainerNames[j] == t.Trainer__r.Name) {
                    
                    // Configure Y-axis for timeline chart
                    tdw.y = j;
                    trainerInMap = true;
                    break;
                } 
            }
            
            // Account for the first time through, when the List is empty
            if(!trainerInMap) {
                trainerNames.add(t.Trainer__r.Name);
                tdw.y = trainerNumber;
                trainerNumber++;
            }

            // x and x2 mark the start and end of the horizontal bar
            tdw.x = t.StartDate__c;
            tdw.x2 = t.EndDate__c;

            // 'series' represents the name of the Training Track
            // These can be seen as radio buttons at the bottom of the graph
            tdw.series = t.TrainingTrack__r.ShortName__c;
            tdw.location = t.TrainingLocation__r.OfficeName__c;
            tdw.color = t.TrainingTrack__r.Color__c;
            tdw.trainerName = t.Trainer__r.Name;
            trainerData.add(tdw);
        }

        // Add all PTOs to the dataset
        for(PTO__c pto : currentPTOs) {

            TrainingDataWrapper tdw = new TrainingDataWrapper();

            // Find the trainer in the list
            Boolean found = false;
            for(j = 0; j < trainerNames.size(); j++) {
                if(trainerNames.get(j) == pto.Trainer__r.Name) {
                    tdw.y = j;
                    found = true;
                    break;
                }
            }

            if (!found) {
                trainerNames.add(pto.Trainer__r.Name);
                tdw.y = trainerNames.size();
            }

            // Mark the start and end dates
            tdw.x = pto.StartDate__c;
            tdw.x2 = pto.EndDate__c;

            // Mark the series as distinct from training track
            tdw.series = 'PTO';
            tdw.location = 'PTO';
            tdw.color = 'Black';
            tdw.trainerName = pto.Trainer__r.Name;
            trainerData.add(tdw);
        }

        return System.json.serialize(trainerData);   
    }
    
    public class TrainingDataWrapper {
        @AuraEnabled
        public Integer y;
        @AuraEnabled
        public Date x;
        @AuraEnabled
        public Date x2;
        @AuraEnabled
        public String series;
        @AuraEnabled
        public String color;
        @AuraEnabled
        public String trainerName;
        @AuraEnabled
        public String location;
    }
    
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

        return wrapTrainingToJSON();
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

        return wrapTrainingToJSON();
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

        return wrapTrainingToJSON();
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

        return wrapTrainingToJSON();
    }

    // Converts year code 1-5 into a real year integer
    // Copy-pasted common logic into a method
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

    // Converts month code 2-5 into a real list of months (integers)
    // Copy-pasted common logic into a method
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