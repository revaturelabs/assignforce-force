public class ApexTestUtilityClass {
    //afTimeLineController TestUtility
    public static void createTrainingsData(Integer numberToCreate){
        List<Training__c> dummyData = new List<Training__c>();
        for(integer i = 0; i < numberToCreate; i++){
            Training__c newM = new Training__c();
            newM.TrainingLocation__c = tLoc.id;
            newM.Trainer__r = users;
            newM.StartDate__c = Date.newInstance(2019, 04, 02);
            newM.EndDate__c = newM.StartDate__c + 4;
            Boolean assignCoTrainer = Math.mod(i, 2) == 0 ? true : false;
            if(assignCoTrainer){
            newM.CoTrainer__r = users;
            }
            Training_Track__c newTrack = new Training_Track__c(ShortName__c = 'TrackShortName ' + i, Color__c = generateTestColorData());
            newM.TrainingTrack__c = newTrack.id;
            
            
            dummyData.add(newM);
        }
        
        System.debug('dummyData: ' + dummyData);
        system.runAs(users){
            insert dummyData;
        }
    }    
    public static void createTrainerRole(){
        UserRole r = new UserRole(DeveloperName = 'MyCustomRole', Name = 'Trainer');
        System.debug('r: ' + r);
        try
        {
            insert r;
        }
        catch(DMLException e){
            e.getMessage();
        }
    }    
    public static Id uID{
        get{
            if(uID == null)
            {
                createTrainerRole();
                uID = [SELECT UserRoleId FROM User WHERE UserRole.name ='Trainer' LIMIT 1].UserRoleId;
            }
            System.debug('UId: ' + uId);
            return uID;
        }
        set;
    }
    public static Training_Location__c tLoc{
        get{
            if(tLoc == null){
                location();
                tLoc = [SELECT Id, Training_Location__c.OfficeName__c From Training_Location__c LIMIT 1];
            }
            System.debug('tLoc: ' + tLoc);
            return tLoc;
        }
        set;
    }    
    public static void location(){
        Training_Location__c tempLoc = new Training_Location__c(
            OfficeName__c = 'OfficeName1'); 
        System.runAs(users){
            try{
                System.debug('TempLoc: ' + tempLoc);
                insert tempLoc;
            }
            catch(DMLException e){
                e.getMessage();
            }
        }
    }    
    public static User getUserData(){
        
        User uData = new User(
            ProfileId = [SELECT Id FROM Profile WHERE Name = 'Trainer' LIMIT 1].id,
            LastName = 'last ' + Math.round(Math.random()),
            Email = 'puser' + Math.round(Math.random()) + '@amamama.com',
            Username = 'puser' + Math.round(Math.random()) + '@amamama.com' + System.currentTimeMillis(),
            CompanyName = 'TEST',
            Title = 'title',
            Alias = 'alias',
            TimeZoneSidKey = 'America/Los_Angeles',
            EmailEncodingKey = 'UTF-8',
            LanguageLocaleKey = 'en_US',
            LocaleSidKey = 'en_US',
            Available__c = 'Available',
            UserRoleId = uID);
        
        System.debug('uData: ' + uData);
        return uData;
        
    }    
    public static User users{
        get{
            if(users == null){
                users = getUserData();
            }
            return users;
        }
        set;
    }    
    public static String generateTestColorData(){
        final String colorHex = '0123456789ABCDEF';
        String newBatchColor ='#';
        for(Integer i = 0; i < 6; i++)
        {
            Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), colorHex.length());
            newBatchColor += colorHex.substring(idx, idx+1);
        }
        if(newBatchColor == '#FFFFFF' || newBatchColor =='#000000'){
            generateTestColorData();
            return null;
        }
        else{
            return newBatchColor;
        }
    }    
    public class TrainingDataWrapperTest
    {
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
    }    
    public static String filterTrainingsByYearLocationQuarterTest(String[] location, Integer year, Integer quarter)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        List<Integer> monthList = new List<Integer>();        
        switch on(quarter)
        {
            when 2
            {
                monthList.add(01);
                monthList.add(02);
                monthList.add(03);
            }
            
            when 3
            {
                monthList.add(04);
                monthList.add(05);
                monthList.add(06);
            }
            
            when 4
            {
                monthList.add(07);
                monthList.add(08);
                monthList.add(09);
            }
            
            when 5
            {
                monthList.add(10);
                monthList.add(11);
                monthList.add(12);
            }
            
            when else
            {
                return null;
            }
        }
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        for(Training__c t : afTimelineController.currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            
            for(String s : location)
            {
                if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == trainingYear && monthList.contains(trainingMonth))
                {
                    NewTrainings.add(t);
                }
                else if(t.TrainingLocation__r.OfficeName__c == s && monthList.contains(trainingMonth) && convertedYear == null){
                    NewTrainings.add(t);
                }
            }
        }
        afTimelineController.currentTrainings = NewTrainings;
        String dataTemp = afTimelineController.wrapTrainingToJSON();
        return dataTemp;
    }
    public static String filterTrainingsByYearLocationTest(String[] location, Integer year)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        
        for(Training__c t : afTimelineController.currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            
            for(String s : Location)
            {
                if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == trainingYear )
                {
                    NewTrainings.add(t);
                }
                else if(t.TrainingLocation__r.OfficeName__c == s && convertedYear == null){
                    NewTrainings.add(t);
                }
            }
        }
        afTimelineController.currentTrainings = NewTrainings;
        String dataTemp = afTimelineController.wrapTrainingToJSON();
        return dataTemp;
    }
    public static String filterTrainingsByYearQuarterTest(Integer year, Integer quarter)
    {
        List<Integer> monthList = new List<Integer>(); 
        List<Training__c> NewTrainings = new List<Training__c>();
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        switch on(quarter)
        {
            when 2
            {
                monthList.add(01);
                monthList.add(02);
                monthList.add(03);
            }
            
            when 3
            {
                monthList.add(04);
                monthList.add(05);
                monthList.add(06);
            }
            
            when 4
            {
                monthList.add(07);
                monthList.add(08);
                monthList.add(09);
            }
            
            when 5
            {
                monthList.add(10);
                monthList.add(11);
                monthList.add(12);
            }
            
            when else
            {
                return null;
            }
        }
        for(Training__c t : afTimelineController.currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            Integer trainingMonth = t.StartDate__c.month();
            
            if(convertedYear == trainingYear && monthList.contains(trainingMonth))
            {
                NewTrainings.add(t);
            }
            else if(monthList.contains(trainingMonth) && convertedYear == null){
                NewTrainings.add(t);
            }
            
        }
        afTimelineController.currentTrainings = NewTrainings;
        String dataTemp = afTimelineController.wrapTrainingToJSON();
        return dataTemp;
    }
    public static String filterTrainingsByYearTest(Integer year)
    {
        List<Training__c> NewTrainings = new List<Training__c>();
        Integer convertedYear = 0;
        
        switch on(year)
        {
            when 1
            {
                convertedYear = Date.today().year() + 1;
            }
            when 2
            {
                convertedYear = Date.today().year();
            }
            
            when 3 
            {
                convertedYear = Date.today().year() - 1;
            }
            
            when 4 
            {
                convertedYear = Date.today().year() - 2;
            }
            when 5
            {
                convertedYear = null;
            }
            
            when else
            {
                return null;
            }
        }
        
        for(Training__c t : afTimelineController.currentTrainings)
        {
            Integer trainingYear = t.StartDate__c.year();
            
            if(convertedYear == trainingYear )
            {
                NewTrainings.add(t);
            }
            else if(convertedYear == null){
                NewTrainings.add(t);
            }
        }
        afTimelineController.currentTrainings = NewTrainings;
        String dataTemp = afTimelineController.wrapTrainingToJSON();
        return dataTemp;
    }   
    public static String[] getTrainingLocationsTest(List<Training__c> actual)
    {
        String[] officeLocations = new String[]{};
            for(Training__c t : actual)
        {
            system.debug('ihsdaihdh');
            officeLocations.add(t.TrainingLocation__r.OfficeName__c);
        }
        return officeLocations;
    }    
    //----------------------------------------------------------------------------------------
    //Test Utility afAvailabilityListContainerController
    
    public static void createTrainingRoomData(Integer numOfRooms){
        List<Training_Room__c> rooms = new List<Training_Room__c>();
        for(integer i = 0; i < numOfRooms; i++){
            Training_Room__c tr = new Training_Room__c();
            tr.TrainingLocation__c = tLoc.id;
            tr.AVAvailability__c = Math.mod(i, 2) == 0 ? 'Yes' : 'No';
            tr.RoomCapacity__c = Math.random();
            
            rooms.add(tr);
        }
        
        system.runAs(users){
            insert rooms;
        }
    }
    public static void createSkills(Integer numOfSkills){
        List<Skill__c> skills = new List<Skill__c>();
        for(integer i = 0; i < numOfSkills; i++){
            Skill__c skill = new Skill__c(Trainer__c = users.id, Training_Track__c = track().id);
            
            skills.add(skill);
        }
        system.runAs(users){
            insert skills;
        }
    }
    public static List<Skill__c> getAllSkills(){
        return [SELECT Training_Track__c, Trainer__c From Skill__c];
    }
    
    public static List<Training_Room__c> getRooms(List<Training_Room__c> allRooms){
        List<Training_Room__c> yesFirst = new List<Training_Room__c>();
        List<Training_Room__c> Requests = new List<Training_Room__c>();
        List<Training_Room__c> NOs = new List<Training_Room__c>();
        
        //Loop through all of the rooms and separate them by their availablity status
        for(Training_Room__c room : allRooms){
            if(room.AVAvailability__c == 'Yes'){
                yesFirst.add(room);
            }else if(room.AVAvailability__c == 'Upon Request'){
                Requests.add(room);
            }else if(room.AVAvailability__c == 'No'){
                NOs.add(room);
            }
        }
        
        //Put all the rooms in one list: 'Yes's first, 'No's last
        yesFirst.addAll(Requests);
        yesFirst.addAll(NOs);
        
        return yesFirst;
    }
    public static List<User> getAllTrainers(List<User> Trainers){
        //Must add a WHERE clause UserRoleId=Trainer Role Id
        List<User> availableList = new List<User>();
        List<User> unavailableList = new List<User>();
        for(User t: Trainers){
            if(t.Available__c=='Available'){
                availableList.add(t);
            }else{
                unavailableList.add(t);
            }
        }
        availableList.addAll(unavailableList);
        system.debug(availableList);
        return availableList;
    }
    public static List<Training__c> getAllTrainings(){
        return [SELECT StartDate__c, EndDate__c, Trainer__c, CoTrainer__c FROM Training__c];
    }
    
    //-----------------------------------------------------------------------------------------
    //Test Utility afCreateNewTrainingTrackTrigger
    public static void createNewTrainingTrack(){
        Training_Track__c newTrack = new Training_Track__c(ShortName__c = 'TrackShortName');
        system.runAs(users){
            insert newTrack;
        }
    }
    public static Training_Track__c track(){
        return [SELECT Id, Name FROM Training_Track__c LIMIT 1];  
    }
    
    public static void createPTOs(Integer n){
        List<PTO__c> ptoToCreate = new List<PTO__c>();
        User u = users;
        for(Integer i=0; i<n; i++){
            PTO__c newpto = new PTO__c(Status__c='Pending Approval',Trainer__c=u.Id);
            ptoToCreate.add(newpto);
        }
        System.runAs(users){
        insert ptoToCreate;
        }
    }
    public static void createManagers(){
       List<User> uList = [SELECT Id FROM User WHERE id != :users.id];
        for(integer i = 0; i < uList.size(); i++){
            uList[i].Manager = users; 
        }
        update uList;
    }
}