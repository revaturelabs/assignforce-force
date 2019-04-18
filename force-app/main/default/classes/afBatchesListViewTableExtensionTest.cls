/**************************************************************************
* afBatchesListViewTableExtension Test Class
* Author: Ian Blanchard
*
* Tests the Apex Extension for the VisualForce page
* Ensures that the extensions constructor sets the pagesize for the 
* StandardSetController correctly, and the cancel button works as intended
***************************************************************************/

@isTest
public class afBatchesListViewTableExtensionTest {

    @isTest
    public static void doTest(){
        
        //Set the current page for the Test to the page being tested.
        PageReference pageRef = Page.afBatchesListViewTable;
        Test.setCurrentPage(pageRef);

        //Instantiate the Training__c Standard Set Controller
        ApexPages.StandardSetController sc = new ApexPages.StandardSetController(new List<Training__c>());

        //Instantiate the extension
        afBatchesListViewTableExtension ext = new afBatchesListViewTableExtension(sc);

        //The constructer set the pagesize to 10 for the standardsetcontroller
        //Check that this worked.
        System.assertEquals(sc.getPageSize(),10);

        //test the cancel button does nothing
        System.assertEquals(afBatchesListViewTableExtension.cancel(),null);
    }

}