public class afAvailListContainerApexController {

    /*------------------------------------------
      Main Sort Methods: Calls subsort methods
    ------------------------------------------*/

    @AuraEnabled
    public static List<User> sortTrainersBySelectedCategories(Date startOfBatch, Date endOfBatch,
                                                             Object chosenTrack, String selectedLocation){
		List<User> sortedList = new List<User>();
        List<List<User>> sortingUserList = new List<List<User>>();
		String chosenTrackString = null;
		if(chosenTrack != null){
	        chosenTrackString = String.valueOf(chosenTrack);
			chosenTrackString = chosenTrackString.removeStart('(');
			chosenTrackString = chosenTrackString.removeEnd(')');
		}
		/* SORTING PRIORITY LIST:
			1. Initially sort by trainers that do not have a scheduled training or PTO that is greater than todays date
				followed by trainers that have scheduled trainings and/or PTOs that are greater than todays date

			2. IF DATES ARE PROVIDED BY NEWBATCHFORM COMPONENT EVENT
				Sort by trainers that do not have a scheduled training and/or PTO during the dates provided followed by
				trainers that have a scheduled training and/or PTO during the dates provided
		
			3. IF SKILL IS PROVIDED BY NEWBATCHFORM COMPONENT EVENT
				Seperately sort the two sublists (i. available; ii. not available) by trainers that have the skill provided
				followed by trainers that do not have the skill provided
			
			4. IF LOCATION IS PROVIDED BY NEWBATCHFORM COMPONENT EVENT
				Seperately sort the two or four sublists (case 2 and/or 3) for trainers that are in the location provided
				followed by trainers that are not in the location provided
		*/
		
		if(startOfBatch == null){
			sortingUserList = sortTrainersAvailNullDates();
        }
		else{
			sortingUserList = sortTrainersAvail(startOfBatch, endOfBatch);
		}
		
		if(chosenTrackString != null){
            sortingUserList = sortBySkill(chosenTrackString, sortingUserList);
		}
        if(selectedLocation != null){
            sortingUserList = sortLocations(selectedLocation, sortingUserList);
		}
		
		//Combine the sublists into final one sorted list to be returned to the view
        for(List<User> sorted : sortingUserList){
            sortedList.addAll(sorted);
		}
    	return sortedList;
    }

    @AuraEnabled
    public static List<Training_Room__c> sortRoomsBySelectedCategories(List<Training_Room__c> allRooms, 
																Date startOfBatch, Date endOfBatch, String selectedLocation){
		//TO-DO Add Filtering for availability
		//TO-DO Add Filtering for room size based on training target size - new parameter passed in
		List<Training_Room__c> sortedRooms = new List<Training_Room__c>();
		List<Training_Room__c> roomsAtLocation = new List<Training_Room__c>();

		if(selectedLocation != null && selectedLocation != ''){
			for(Training_Room__c roomAtLoc : allRooms){
				if(selectedLocation == roomAtLoc.TrainingLocationName__c){
					roomsAtLocation.add(roomAtLoc);
				}
			}

			return roomsAtLocation;
		} else {
			return allRooms;
		}
	}
	
	/*------------------------------------------
				  Subsort methods
    ------------------------------------------*/
	
	
	//METHOD 1: INITIALIZE - AVAILABILITY WITH NO DATES
	
    public static List<List<User>> sortTrainersAvailNullDates(){
	
        //CombinedList returns two sub lists of Available and notAvailable trainers
        List<List<User>> combinedList = new List<List<User>>();

        //Two Queries:
		//		1. Query for all trainers that do not have a current training and/or PTO during any time after todays date
		//		2. Query for the opposite case for trainers that have trainings and/or PTO during any time after todays date
		
		List<ID> upcomingTrainingsUsers = new List<ID>();
		for (Training__c t : [SELECT Trainer__c FROM Training__c WHERE EndDate__c > TODAY]){
			upcomingTrainingsUsers.add(t.Trainer__c);
		}

		List<ID> upcomingPTOsUsers = new List<ID>();
		for (PTO__c t : [SELECT Trainer__c FROM PTO__c WHERE EndDate__c > TODAY AND Status__c = 'Approved']){
			upcomingPTOsUsers.add(t.Trainer__c);
		}

        List<User> notAvail = [SELECT Id, name, CurrentLocation__c, Available__c, hasSkill__c
                                FROM User 
                                WHERE (Id IN :upcomingTrainingsUsers
                                OR Id IN :upcomingPTOsUsers)
                                AND Profile.Name = 'Trainer'
								ORDER BY LastName];

        List<User> Avail = [ SELECT Id, name, CurrentLocation__c, Available__c, hasSkill__c
                                FROM User 
                                WHERE Id NOT IN :upcomingTrainingsUsers
                                AND Id NOT IN :upcomingPTOsUsers
                                AND Profile.Name = 'Trainer'
								ORDER BY LastName];

        for(User u: Avail){
			u.Available__c = 'Available';
		}
        for(User u: notAvail){
			u.Available__c = 'Not Available';
		}

		//Add available and not available user lists to the combined list for further sorting or for combining and returning
		combinedList.add(Avail);
        combinedList.add(notAvail);
        return combinedList;
    }
	
	//METHOD 2: AVAILABILITY WITH DATES
	
    public static List<List<User>> sortTrainersAvail(Date startOfBatch, Date endOfBatch){
	
        //CombinedList returns two sub lists of Available and notAvailable trainers
        List<List<User>> combinedList = new List<List<User>>();

        //Two Queries:
		//		1. Query for all trainers that do not have a current training or PTO during the user selected dates
		//		2. Query for the opposite case for trainers that are currently busy during dates in question
		List<ID> upcomingTrainingsUsers = new List<ID>();
		for (Training__c t : [SELECT Trainer__c FROM Training__c WHERE (StartDate__c < :startOfBatch AND EndDate__c > :startOfBatch) OR 
																	   (StartDate__c < :endOfBatch AND EndDate__c > :endOfBatch)]){
			upcomingTrainingsUsers.add(t.Trainer__c);
		}

		List<ID> upcomingPTOsUsers = new List<ID>();
		for (PTO__c t : [SELECT Trainer__c FROM PTO__c WHERE ((StartDate__c < :startOfBatch AND EndDate__c > :startOfBatch) OR 
															 (StartDate__c < :endOfBatch AND EndDate__c > :endOfBatch)) AND Status__c = 'Approved']){
			upcomingPTOsUsers.add(t.Trainer__c);
		}
		
        List<User> notAvail = [SELECT Id, name, CurrentLocation__c, Available__c, hasSkill__c
                            FROM User 
                            WHERE (Id IN :upcomingTrainingsUsers
                            OR Id IN :upcomingPTOsUsers)
                           	AND Profile.Name = 'Trainer'
							ORDER BY LastName];

        List<User> Avail = [ SELECT Id, name, CurrentLocation__c, Available__c, hasSkill__c
                                FROM User 
                                WHERE Id NOT IN :upcomingTrainingsUsers
                                AND Id NOT IN :upcomingPTOsUsers
                              	AND Profile.Name = 'Trainer'
								ORDER BY LastName];

        for(User u: Avail){
			u.Available__c = 'Available';
		}
        for(User u: notAvail){
			u.Available__c = 'Not Available';
		}

		//Add available and not available user lists to the combined list for further sorting or for combining and returning
		combinedList.add(Avail);
        combinedList.add(notAvail);
        return combinedList;
    }
	
	//METHOD 3: TRAINERS MATCHING WITH SKILLS
	
    public static List<List<User>> sortBySkill(String chosenTrack, List<List<User>> sortListOfUsers){
		
		/*CombinedList returns four sub lists of Available-hasSkill, Available-noSkill, notAvailable-hasSkill and notAvailable-noSkill
		and notAvailable-noSkill trainers*/
		List<List<User>> combinedList = new List<List<User>>();

		//Seperate sortListOfUsers which will contain available or not available Trainer lists
		List<User> availableTrainers = sortListOfUsers[0];
		List<User> notAvailableTrainers = sortListOfUsers[1];
		
		//Create four lists for the combined list of lists
		List<User> availSkill = new List<User>();
		List<User> availNoSkill = new List<User>();
		List<User> notAvailSkill = new List<User>();
		List<User> notAvailNoSkill = new List<User>();

		//Two Queries:
		//		1. Query for all trainers that match the selected skill
		//		2. Query for all trainers that do not match the selected skill
		List<User> matchSkill = [SELECT Id, name, CurrentLocation__c
									FROM User 
									WHERE Id IN (SELECT Trainer__c
													FROM Skill__c 
													WHERE Training_Track__c = :chosenTrack)
                                	AND Profile.Name = 'Trainer'
									ORDER BY LastName];

		List<User> noMatchingSkill = [SELECT Id, name, CurrentLocation__c
										FROM User 
										WHERE Id NOT IN (SELECT Trainer__c
															FROM Skill__c 
															WHERE Training_Track__c = :chosenTrack)
                                     	AND Profile.Name = 'Trainer'
										ORDER BY LastName];

		/*
			For loop to compare matching skills with availability to add each case to the correct lists
			**Developer Note: After much deliberation we went with this for loop structure because it limits
				our operation complexity to O(2n) or O(n), rather than using nested for loops and risking 
				O(n^2) or worse for this logic.**
				
			BUG: The contains method does not work with the lists of sObjects as intended. The correct
				solution to maintain O(n) would be to change the List<List<User>> to a List<Map<Id,User>>.
				The solution seen below has O(n^2) due to time constraints.
		*/

		for(User trainerWithSkill: matchSkill){
			for (User u : availableTrainers)
				if (u.id == trainerWithSkill.id){
					u.hasSkill__c = true;
					availSkill.add(u);
				}
			for (User u : notAvailableTrainers){
				if (u.id == trainerWithSkill.id){
					u.hasSkill__c = true;
					notAvailSkill.add(u);
				}
			}
			/**********************************************************
			if(availableTrainers.contains(trainerWithSkill)){
				trainerWithSkill.hasSkill__c = true;
				availSkill.add(trainerWithSkill);
			}
			else if(notAvailableTrainers.contains(trainerWithSkill)){
				trainerWithSkill.hasSkill__c = true;
				notAvailSkill.add(trainerWithSkill);
			}
			**********************************************************/
		}
		
		for(User trainerWithoutSkill: noMatchingSkill){
			for (User u : availableTrainers)
				if (u.id == trainerWithoutSkill.id){
					u.hasSkill__c = false;
					availNoSkill.add(u);
				}
			for (User u : notAvailableTrainers){
				if (u.id == trainerWithoutSkill.id){
					u.hasSkill__c = false;
					notAvailNoSkill.add(u);
				}
			}
			/*************************************************************
			if(availableTrainers.contains(trainerWithoutSkill)){
				availNoSkill.add(trainerWithoutSkill);
			}
			else if(notAvailableTrainers.contains(trainerWithoutSkill)){
				notAvailNoSkill.add(trainerWithoutSkill);
			}
			*************************************************************/
		}

		//Add Available-hasSkill, Available-noSkill, notAvailable-hasSkill and notAvailable-noSkill user lists to the combined list 
		//for further sorting or for combining and returning
		combinedList.add(availSkill);
		combinedList.add(availNoSkill);
		combinedList.add(notAvailSkill);
		combinedList.add(notAvailNoSkill);

		return combinedList;
    }
		
	//METHOD 4: TRAINERS MATCHING WITH LOCATION
	
    public static List<List<User>> sortLocations(String selectedLocation, List<List<User>> sortListOfUsers){
		
		/*CombinedList returns all sub lists (either 2 if only location is provided or 4 sublists if skill is provided as well) of trainers*/
		List<List<User>> combinedList = new List<List<User>>();

		
		//Two Queries:
		//		1. Query for all trainers that match the selected location
		//		2. Query for all trainers that do not match the selected location
		List<User> atLocation = [SELECT Id, name, CurrentLocation__c
									FROM User 
									WHERE CurrentLocation__c = :selectedLocation
                                	AND Profile.Name = 'Trainer'
									ORDER BY LastName];

		List<User> notAtLocation = [SELECT Id, name, CurrentLocation__c
										FROM User 
										WHERE CurrentLocation__c != :selectedLocation
                                   		AND Profile.Name = 'Trainer'
										ORDER BY LastName];						
		
		/*	IF-ELSE IF LOGIC:
				1. No skill sorting, default available and not available lists will be contained in sortListOfUsers
				2. Skill sorting will seperate sortListOfUsers into 4 lists: Available-hasSkill, Available-noSkill, notAvailable-hasSkill and notAvailable-noSkill Trainer Lists
		*/
		if(sortListOfUsers.size() == 2){
			
			//Seperate sortListOfUsers which will contain available or not available Trainer lists
			List<User> availableTrainers = sortListOfUsers[0];
			List<User> notAvailableTrainers = sortListOfUsers[1];
				
			//Create four lists for the combined list of lists
			List<User> availAtLocation = new List<User>();
			List<User> availNotAtLocation = new List<User>();
			List<User> notAvailAtLocation = new List<User>();
			List<User> notAvailNotAtLocation = new List<User>();
				
			/*
				For loop to compare matching skills with availability to add each case to the correct lists
				**Developer Note: After much deliberation we went with this for loop structure because it limits
					our operation complexity to O(2n) or O(n), rather than using nested for loops and risking 
					O(n^2) or worse for this logic.**
				
				BUG: The contains method does not work with the lists of sObjects as intended. The correct
					solution to maintain O(n) would be to change the List<List<User>> to a List<Map<Id,User>>.
					The solution seen below has O(n^2) due to time constraints.
			*/

			for(User trainerAtLocation: atLocation){
				for (User u : availableTrainers)
					if (u.id == trainerAtLocation.id)
						availAtLocation.add(u);
				for (User u : notAvailableTrainers)
					if (u.id == trainerAtLocation.id)
						notAvailAtLocation.add(u);
				/*************************************************************
				if(availableTrainers.contains(trainerAtLocation)){
					availAtLocation.add(trainerAtLocation);
				}
				else if(notAvailableTrainers.contains(trainerAtLocation)){
					notAvailAtLocation.add(trainerAtLocation);
				}
				*************************************************************/
			}
			
			for(User trainerNotAtLocation: notAtLocation){
				for (User u : availableTrainers)
					if (u.id == trainerNotAtLocation.id)
						availAtLocation.add(u);
				for (User u : notAvailableTrainers)
					if (u.id == trainerNotAtLocation.id)
						notAvailAtLocation.add(u);
				/******************************************************************
				if(availableTrainers.contains(trainerNotAtLocation)){
					availNotAtLocation.add(trainerNotAtLocation);
				}
				else if(notAvailableTrainers.contains(trainerNotAtLocation)){
					notAvailNotAtLocation.add(trainerNotAtLocation);
				}
				******************************************************************/
			}

			//Add Available-hasSkill, Available-noSkill, notAvailable-hasSkill and notAvailable-noSkill user lists to the combined list for combining and returning
			combinedList.add(availAtLocation);
			combinedList.add(availNotAtLocation);
			combinedList.add(notAvailAtLocation);
			combinedList.add(notAvailNotAtLocation);

		}
		else if(sortListOfUsers.size() == 4){
		
			//Seperate sortListOfUsers which will contain Available-hasSkill, Available-noSkill, notAvailable-hasSkill and notAvailable-noSkill Trainer Lists			
			List<User> availSkillTrainers = sortListOfUsers[0];
			List<User> availNoSkillTrainers = sortListOfUsers[1];
			List<User> notAvailSkillTrainers = sortListOfUsers[2];
			List<User> notAvailNoSkillTrainers = sortListOfUsers[3];

			//Create eight lists for the combined list of lists - in order of sorting priority
			
			List<User> availWithSkillAtLocation = new List<User>();					//Available - With skill - At Location				1ST FOR LOOP
			List<User> availWithSkillNotAtLocation = new List<User>();				//Available - With skill - Not At Location			2ND FOR LOOP
			List<User> availWithoutSkillAtLocation = new List<User>();				//Available - Without skill - At Location			1ST FOR LOOP
			List<User> availWithoutSkillNotAtLocation = new List<User>();			//Available - Without skill - Not At Location		2ND FOR LOOP
			
			List<User> notAvailWithSkillAtLocation = new List<User>();				//Not Available - With skill - At Location			1ST FOR LOOP
			List<User> notAvailWithSkillNotAtLocation = new List<User>();			//Not Available - With skill - Not At Location		2ND FOR LOOP
			List<User> notAvailWithoutSkillAtLocation = new List<User>();			//Not Available - Without skill - At Location		1ST FOR LOOP
			List<User> notAvailWithoutSkillNotAtLocation = new List<User>();		//Not Available - Without skill - Not At Location	2ND FOR LOOP

			/*
				For loops to compare matching location with skills and with availability to add each case to the correct lists
				**Developer Note: After much deliberation we went with this for loop structure because it limits
					our operation complexity to O(4n) or O(n), rather than using nested for loops and risking 
					O(n^4) or worse for this logic.**
				
				BUG: The contains method does not work with the lists of sObjects as intended. The correct
					solution to maintain O(n) would be to change the List<List<User>> to a List<Map<Id,User>>.
					The solution seen below has O(n^2) due to time constraints.
			*/

			for(User trainerAtLocation : atLocation){								//1ST FOR LOOP
				for (User u : availSkillTrainers)
					if (u.id == trainerAtLocation.id)
						availWithSkillAtLocation.add(u);
				for (User u : availNoSkillTrainers)
					if (u.id == trainerAtLocation.id)
						availWithoutSkillAtLocation.add(u);
				for (User u : notAvailSkillTrainers)
					if (u.id == trainerAtLocation.id)
						notAvailWithSkillAtLocation.add(u);
				for (User u : notAvailNoSkillTrainers)
					if (u.id == trainerAtLocation.id)
						notAvailWithoutSkillAtLocation.add(u);
				/**************************************************************
				if(availSkillTrainers.contains(trainerAtLocation)){
					availWithSkillAtLocation.add(trainerAtLocation);
				}
				else if(availNoSkillTrainers.contains(trainerAtLocation)){
					availWithoutSkillAtLocation.add(trainerAtLocation);
				}
				else if(notAvailSkillTrainers.contains(trainerAtLocation)){
					notAvailWithSkillAtLocation.add(trainerAtLocation);
				}
				else if(notAvailNoSkillTrainers.contains(trainerAtLocation)){
					notAvailWithoutSkillAtLocation.add(trainerAtLocation);
				}
				***************************************************************/
			}
			
			for(User trainerNotAtLocation: notAtLocation){							//2ND FOR LOOP
				for (User u : availSkillTrainers)
					if (u.id == trainerNotAtLocation.id)
						availWithSkillAtLocation.add(u);
				for (User u : availNoSkillTrainers)
					if (u.id == trainerNotAtLocation.id)
						availWithoutSkillAtLocation.add(u);
				for (User u : notAvailSkillTrainers)
					if (u.id == trainerNotAtLocation.id)
						notAvailWithSkillAtLocation.add(u);
				for (User u : notAvailNoSkillTrainers)
					if (u.id == trainerNotAtLocation.id)
						notAvailWithoutSkillNotAtLocation.add(u);
				/****************************************************************
				if(availSkillTrainers.contains(trainerNotAtLocation)){
					availWithSkillNotAtLocation.add(trainerNotAtLocation);
				}
				else if(availNoSkillTrainers.contains(trainerNotAtLocation)){
					availWithoutSkillNotAtLocation.add(trainerNotAtLocation);
				}
				else if(notAvailSkillTrainers.contains(trainerNotAtLocation)){
					notAvailWithSkillNotAtLocation.add(trainerNotAtLocation);
				}
				else if(notAvailNoSkillTrainers.contains(trainerNotAtLocation)){
					notAvailWithoutSkillNotAtLocation.add(trainerNotAtLocation);
				}
				******************************************************************/
			}
			
			//Add the eight lists in priority to the combined list for combining and returning
			combinedList.add(availWithSkillAtLocation);
			combinedList.add(availWithSkillNotAtLocation);
			combinedList.add(availWithoutSkillAtLocation);
			combinedList.add(availWithoutSkillNotAtLocation);
			combinedList.add(notAvailWithSkillAtLocation);
			combinedList.add(notAvailWithSkillNotAtLocation);
			combinedList.add(notAvailWithoutSkillAtLocation);
			combinedList.add(notAvailWithoutSkillNotAtLocation);
		}
		
		return combinedList;
	}
	
}