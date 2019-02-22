({
	sortTrainers : function(trainerList) {
        return trainerList.sort((a,b) => (a.Available__c>b.Available__c) ? 1 : (a.Available__c==b.Available__c) ? ((a.Name>b.Name) ? 1 :-1) :-1);
	}
})