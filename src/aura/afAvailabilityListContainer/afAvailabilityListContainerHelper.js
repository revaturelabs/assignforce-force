({
	sortTrainers : function(trainerList) {
        // sort method that sorts the trainers by available first then by name
        return trainerList.sort((a,b) => (a.Available__c>b.Available__c) ? 1 : (a.Available__c==b.Available__c) ? ((a.Name>b.Name) ? 1 :-1) :-1);
	}
})