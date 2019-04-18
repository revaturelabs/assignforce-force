/********************************************************************
* afApprovalButtonExtension Test Class
* Author: Ian Blanchard
*
* Unit Tests for the Following VF Page Extensions:
*  -afApproveButtonExtension
*  -afRejectButtonExtension
*
*  These extensions will approve/reject the selected PTO records
*      from the list view with a button added to the top of the page.
*      This test creates many PTO requests and runs both extensions 
*      to approve some, reject some, and ignore others.
*********************************************************************/


@isTest
public class afApprovalButtonExtensionTests {

    @TestSetup
    static void doSetup(){
        
        User u = UtilityMethods.createUserData(1).get(0);
        insert u;
      
    }

    @isTest
    public static void doTest() {

        //Initialize the pages StandardSetController
        ApexPages.StandardSetController sc = new ApexPages.StandardSetController(new List<PTO__c>());

        //Initialize ApproveButton and RejectButton Extensions
        afApproveButtonExtension approveExt = new afApproveButtonExtension(sc);
        afRejectButtonExtension rejectExt = new afRejectButtonExtension(sc);

        //Check that the standardsetcontrollers are set correctly
        System.assertEquals(approveExt.controller, sc);
        System.assertEquals(rejectExt.controller, sc);

        //Create a user to submit PTO requests
        User trainer = [SELECT id FROM User LIMIT 1];
        


        //Running as a Trainer User, Create 200 PTO requests and insert to database
        //This initiates the approval process as well. The Process that auto-submits
        //for approval is what requires this to be runAs a user
        List<PTO__c> ptos = new List<PTO__c>();
        System.runAs(trainer){
            for (Integer i = 0; i < 300; i++){
                PTO__c p = new PTO__c(StartDate__c = Date.today(),
                                    EndDate__c = Date.today().addDays(1),
                                    Status__c = 'Needs to be Submitted',
                                    Trainer__c = trainer.id);
                ptos.add(p);
            }
            insert ptos;
        }

        List<PTO__c> toBeApproved = [SELECT id FROM PTO__c LIMIT 100];
        List<PTO__c> toBeRejected = [SELECT id FROM PTO__c LIMIT 100 OFFSET 100];

        //Set the list of requests to be approved as Selected in the standard set controller
        // and then run the saveAndRefresh method which will complete the approval process
        // for those requests, approving the PTO
        approveExt.controller.setSelected(toBeApproved);
        PageReference runApproveMethod = approveExt.saveAndRefresh();

        //Set the list of requests to be rejected as Selected in the standard set controller
        // and then run the saveAndRefresh method which will complete the approval process
        // for those requests, rejecting the PTO
        rejectExt.controller.setSelected(toBeRejected);
        PageReference runRejectMethod = rejectExt.saveAndRefresh();


        //Counters for how many requests were Approved, Rejected, or still Pending
        Integer approved = 0;
        Integer rejected = 0;
        Integer pending = 0;

        //Check that all the PTO requests in the list were approved
        List<PTO__c> ptoResults = [SELECT id, status__c FROM PTO__c LIMIT 300];
        for (PTO__c p : ptoResults) {
            if (p.Status__c == 'Approved')
                approved++;
            else if (p.Status__c == 'Rejected')
                rejected++;
            else 
                pending++;
        }

        //There should be 100 approved PTO requests, 100 rejected requests,
        // and 100 still pending that we inserted but did NOT select
        System.assertEquals(approved,100);
        System.assertEquals(rejected,100);
        System.assertEquals(pending,100);

    }

}