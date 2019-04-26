/*
 * Class afApproveButtonExtension
 * Created by: Evan Strohm
 * Created on: 3/19/2019
 * Last Modified: 3/19/2019
 * 
 * Description: Controller extension for afApproveButtonPage
 * Approves the selected PTO Requests, then refreshes the page
 */
public class afApproveButtonExtension {
    
    // Standard controller used to work with default PTO Request list
    public ApexPages.StandardSetController controller;
    
    /*
     * Constructor
     * Parameters:
     * 		ApexPages.StandardSetController - Provided by VisualForce
     */
    public afApproveButtonExtension(ApexPages.StandardSetController c) {
        controller = c;
    }
    
    /*
     * saveAndRefresh()
     * Parameters: none
     * 
     * Approves currently selected records and refreshes the page
     */
    public PageReference saveAndRefresh() {
        // Grab the selected records from the standard controller
        List<PTO__c> PTOs = (List<PTO__c>) controller.getSelected();
        // Store their IDs in a set for reference in later SOQL queries
        Set<Id> PtoIds = new Set<Id>();
        for (PTO__c pto : PTOs) {
            System.debug('Found PTO: ' + pto.Id);
            PtoIds.add(pto.id);
        }
        
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
                                  WHERE TargetObjectID IN :PtoIds]) {
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
            reqs.add(req);
        }
        // Process all approvals at once to avoid DML limits
        Approval.process(reqs);
        
        // Return to the list view
        return new PageReference('/lightning/o/PTO__c/list');
    }
}