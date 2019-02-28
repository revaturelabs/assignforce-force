({
    sortPTOs : function(List) {
        return List.sort(function compare(a, b) {
            var dateA = new Date(a.StartDate__c);
            var dateB = new Date(b.StartDate__c);
            return dateA - dateB;
        });
    }
})