public class CreateAssignForceData {
    
    public static void createTrainingLocations(){
        List<Training_Location__c> locationsToCreate = new List<Training_Location__c>();
        List<String> officeNames = new List<String>{'Fairfax', 'SPS', 'Reston', 'UTA-ERB', 'USF-NEC', 'ASU', 'WVU-CBE', 'Queens', 'USF-SOC', 'Online', 'USF-BSN', 'UTA-PRS','UTA-KC'};
        List<String> shippingStreets = new List<String>{'10565 Fairfax Blvd', 'CUNY School of Processional Studies', 'Plaza America Office Park', 'UTA Engineering Research Building','USF Northwest Education Complex', 'SkySong Innovation Center', 'WVU College of Business and Economics', 'Tech Incubator at Queens College', 'USF Department of Sociology', 'Online', 'USF Muma College of Business', 'UTA Preston Hall', 'UTA Kalpana Chawla Hall'};
        List<String> shippingCities = new List<String>{'Fairfax', 'New York', 'Reston', 'Arlington', 'Tampa', 'Scottsdale', 'Morgantown', 'Queens', 'Tampa', 'Reston', 'Tampa', 'Arlington', 'Arlington'};    
        List<String> shippingStates = new List<String>{'Virginia', 'New York', 'Virginia', 'Texas', 'Florida', 'Arizona', 'West Virginia', 'New York', 'Florida', 'Virginia', 'Florida', 'Texas', 'Texas'};
            for(Integer i = 0; i < officeNames.size(); i++){
                Training_Location__c newTL = new Training_Location__c();
                newTL.OfficeName__c = officeNames[i];
                newTL.ShippingStreetAddress__c = shippingStreets[i];
                newTL.ShippingCity__c = shippingCities[i];
                newTL.ShippingState__c = shippingStates[i];
                locationsToCreate.add(newTL);
            }
        insert locationsToCreate;
    }
    
    public static void createTrainingRooms(){
        Map<String, ID> locMap = new Map<String, ID>();
        for(Training_Location__c tl : [SELECT Id, OfficeName__c FROM Training_Location__c]){
            locMap.put(tl.OfficeName__c, tl.Id);
        }
        List<Training_Room__c> roomsToCreate = new List<Training_Room__c>();
        /*Fairfax*/
        roomsToCreate.add(new Training_Room__c(Name = 'Galileo', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'Tesla', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'Newton', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'Franklin', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'Currie', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'Copernicus', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'Hawking', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'Einstein', TrainingLocation__c = locMap.get('Fairfax'), RoomCapacity__c = 16, Active__c = false, AVAvailability__c = 'Yes'));
        /*Online*/
        roomsToCreate.add(new Training_Room__c(Name = '1', TrainingLocation__c = locMap.get('Online'), RoomCapacity__c = 35, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = '2', TrainingLocation__c = locMap.get('Online'), RoomCapacity__c = 35, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = '3', TrainingLocation__c = locMap.get('Online'), RoomCapacity__c = 35, Active__c = true, AVAvailability__c = 'Yes'));
        /*Queens*/
        roomsToCreate.add(new Training_Room__c(Name = 'QC 16', TrainingLocation__c = locMap.get('Queens'), RoomCapacity__c = 25, Active__c = true, AVAvailability__c = 'Yes'));
        /*Reston*/
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 202', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 25, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 214', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 208', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 201', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 35, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 203', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 35, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 204', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 25, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 209', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 206', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 25, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 207', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 205', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 25, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'HQ 452', TrainingLocation__c = locMap.get('Reston'), RoomCapacity__c = 40, Active__c = false, AVAvailability__c = 'Yes'));
        /*SPS*/
        roomsToCreate.add(new Training_Room__c(Name = 'SPS 216', TrainingLocation__c = locMap.get('SPS'), RoomCapacity__c = 25, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'SPS 220', TrainingLocation__c = locMap.get('SPS'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'SPS 204', TrainingLocation__c = locMap.get('SPS'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        /*USF-BSN*/
        roomsToCreate.add(new Training_Room__c(Name = 'BSN 1310', TrainingLocation__c = locMap.get('USF-BSN'), RoomCapacity__c = 40, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'BSN 1200', TrainingLocation__c = locMap.get('USF-BSN'), RoomCapacity__c = 40, Active__c = false, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'BSN 1400', TrainingLocation__c = locMap.get('USF-BSN'), RoomCapacity__c = 26, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'BSN 1304', TrainingLocation__c = locMap.get('USF-BSN'), RoomCapacity__c = 26, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'BSN 2301B', TrainingLocation__c = locMap.get('USF-BSN'), RoomCapacity__c = 15, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'BSN 2301C', TrainingLocation__c = locMap.get('USF-BSN'), RoomCapacity__c = 15, Active__c = true, AVAvailability__c = 'Yes'));
        /*USF-NEC*/
        roomsToCreate.add(new Training_Room__c(Name = 'NEC 200A', TrainingLocation__c = locMap.get('USF-NEC'), RoomCapacity__c = 26, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'NEC 300', TrainingLocation__c = locMap.get('USF-NEC'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'NEC 200B', TrainingLocation__c = locMap.get('USF-NEC'), RoomCapacity__c = 26, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'NEC 107', TrainingLocation__c = locMap.get('USF-NEC'), RoomCapacity__c = 24, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'NEC 328', TrainingLocation__c = locMap.get('USF-NEC'), RoomCapacity__c = 45, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'NEC 320', TrainingLocation__c = locMap.get('USF-NEC'), RoomCapacity__c = 28, Active__c = true, AVAvailability__c = 'Yes'));
        /*USF-SOC*/
        roomsToCreate.add(new Training_Room__c(Name = 'SOC 145', TrainingLocation__c = locMap.get('USF-SOC'), RoomCapacity__c = 30, Active__c = false, AVAvailability__c = 'Yes'));
        /*UTA-ERB*/
        roomsToCreate.add(new Training_Room__c(Name = 'UTA-ERB 324', TrainingLocation__c = locMap.get('UTA-ERB'), RoomCapacity__c = 40, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'UTA-ERB 334', TrainingLocation__c = locMap.get('UTA-ERB'), RoomCapacity__c = 40, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'UTA-ERB TBD', TrainingLocation__c = locMap.get('UTA-ERB'), RoomCapacity__c = 35, Active__c = true, AVAvailability__c = 'Yes'));
        /*UTA-KC*/
        roomsToCreate.add(new Training_Room__c(Name = 'KC M112', TrainingLocation__c = locMap.get('UTA-KC'), RoomCapacity__c = 25, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'KC M114', TrainingLocation__c = locMap.get('UTA-KC'), RoomCapacity__c = 25, Active__c = true, AVAvailability__c = 'Yes'));
        /*UTA-PRS*/
        roomsToCreate.add(new Training_Room__c(Name = 'UTA-PRS 306', TrainingLocation__c = locMap.get('UTA-PRS'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        /*WVU-CBE*/
        roomsToCreate.add(new Training_Room__c(Name = 'WVU-001', TrainingLocation__c = locMap.get('WVU-CBE'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'WVU-002', TrainingLocation__c = locMap.get('WVU-CBE'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        roomsToCreate.add(new Training_Room__c(Name = 'WVU-003', TrainingLocation__c = locMap.get('WVU-CBE'), RoomCapacity__c = 30, Active__c = true, AVAvailability__c = 'Yes'));
        
        insert roomsToCreate;
    }
    
    public static void createTrainingTracks(){
        List<Training_Track__c> tracksToCreate = new List<Training_Track__c>();
        List<String> names = new List<String>{'Big Data/Hadoop', 'Oracle Fusion Middleware', 'Full Stack .NET', 'Microservices', 'Business Analyst', 'ETL/Informatics', 'Web Tools', 'Dynamics CRM', 'Full Stack Java/JEE', 'Salesforce', 'System Admin', 'Full Stack JTA', 'Appian BPM'};
        List<String> shortNames = new List<String>{'Big Data', 'Oracle', '.NET', 'Microservices', 'BA', 'ETL', 'Web Tools', 'Dynamics', 'Java', 'Salesforce', 'SysAdmin', 'JTA', 'Appian'};
            for(Integer i = 0; i < names.size(); i++){
                tracksToCreate.add(new Training_Track__c(Active__c = true, Name = names[i], ShortName__c = shortNames[i]));
            }
        insert tracksToCreate;
    }
    
}