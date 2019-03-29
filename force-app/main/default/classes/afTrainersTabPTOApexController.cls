public class afTrainersTabPTOApexController {

   @auraEnabled
   public static List<PTO__c> getTrainingPTOById(Id userId){
       system.debug(userId);
       List<PTO__c> trainerPTO = [SELECT StartDate__c , EndDate__c, Reason__c, Status__c
                                  FROM PTO__c
                                  WHERE Trainer__c = :userId  AND EndDate__c > TODAY AND Status__c != 'Rejected'
                                  ORDER BY StartDate__c];
       system.debug(trainerPTO);
       return trainerPTO;
   }

   @AuraEnabled
   public static void approvePTO(Id ptoIdToApprove){
       System.debug('approvePTO: ' + ptoIdToApprove);
        /*	This next part is complicated. Basically, I want both the ProcessInstance
		 *	AND ProcessInstanceWorkItem that refer to a PTO request that is selected.
		 *	However, the only reference to the ProcessInstance from the 
		 *	ProcessInstanceWorkItem is an ID, not a followable relationship, so you
		 *	can't query it directly or get it after the fact without nested SOQL or
		 *	SOQL in a loop, which I didn't want, so I query for ProcessInstanceWorkItem
		 *	and put them in a map from their respective ProcessInstance, which works
		 *	since there is only 1 per ProcessInstance in our case.*/
        Map</*ProcessInstance*/ Id, /*ProcessInstanceWorkItem*/ Id> m = new Map<Id, Id>();
        for (ProcessInstanceWorkItem p : [SELECT Id, ProcessInstanceId FROM ProcessInstanceWorkItem]) {
            m.put(p.ProcessInstanceId, p.Id);
        }
        System.debug('Map: ' + m);
        ProcessInstance p = [SELECT Id, TargetObjectID
                                  FROM ProcessInstance
                                  WHERE TargetObjectID = :ptoIdToApprove];
        System.debug('ProcessInstance: ' + p);
        /* 
         * 	Set info about the approval:
         * 		Default comments
         * 		Approve rather than reject
         * 		Set approver to the current user
         * 		Set which request to approve
         */
        Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
        req.setComments('Approved');
        req.setAction('Approve');
        req.setNextApproverIds(new Id[] {UserInfo.getUserId()});
        req.setWorkItemId(m.get(p.Id));
        // Process all approvals at once to avoid DML limits
        Approval.process(req);
        System.debug('/approvePTO');
   }

   @AuraEnabled
   public static void rejectPTO(Id ptoIdToReject){
        /*	This next part is complicated. Basically, I want both the ProcessInstance
		 *	AND ProcessInstanceWorkItem that refer to a PTO request that is selected.
		 *	However, the only reference to the ProcessInstance from the 
		 *	ProcessInstanceWorkItem is an ID, not a followable relationship, so you
		 *	can't query it directly or get it after the fact without nested SOQL or
		 *	SOQL in a loop, which I didn't want, so I query for ProcessInstanceWorkItem
		 *	and put them in a map from their respective ProcessInstance, which works
		 *	since there is only 1 per ProcessInstance in our case.*/
        Map</*ProcessInstance*/ Id, /*ProcessInstanceWorkItem*/ Id> m = new Map<Id, Id>();
        for (ProcessInstanceWorkItem p : [SELECT Id, ProcessInstanceId FROM ProcessInstanceWorkItem]) {
            m.put(p.ProcessInstanceId, p.Id);
        }
        List<Approval.ProcessWorkItemRequest> reqs = new List<Approval.ProcessWorkitemRequest>();
        for (ProcessInstance p : [SELECT Id, TargetObjectID
                                  FROM ProcessInstance
                                  WHERE TargetObjectID = :ptoIdToReject]) {
            /* 
             * 	Set info about the approval:
             * 		Default comments
             * 		Approve rather than reject
             * 		Set approver to the current user
             * 		Set which request to approve
             */
            Approval.ProcessWorkitemRequest req = new Approval.ProcessWorkitemRequest();
        	req.setComments('Rejected');
            req.setAction('Reject');
           	req.setNextApproverIds(new Id[] {UserInfo.getUserId()});
            req.setWorkItemId(m.get(p.Id));
            reqs.add(req);
        }
        // Process all approvals at once to avoid DML limits
        Approval.process(reqs);
    }
}