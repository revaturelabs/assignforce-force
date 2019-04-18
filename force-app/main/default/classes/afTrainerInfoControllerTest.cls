/****************************************************
* afTrainerInfoController Test Class
* Author: Oscar Su
* 
* Testing class for AfTrainerInfoController.apxc
****************************************************/
@isTest
public class afTrainerInfoControllerTest {
    
    @testSetup
    //Creates base set up, which is a list of users, currently creating 20 users at the start
    public static void doSetup() {

        List<User> users = UtilityMethods.createUserData(20);
        insert users;

    }
    
    @isTest
    public static void doTest() {
        
        Test.startTest();
        
        /***************************************
        * Single input test
        * Obtains the first user of the list and uses it to run a create content which creates
        * a new contentVersion. Then using a SOQL query call the newly generated document and compare the
        * document createdbyid to the tempuserSingle id;.
        * If matches, then it's successful.
        ***************************************/
        User tempUserSingle = [SELECT id, name FROM User WHERE LastName = 'last 0' Limit 1];
        System.runAs(tempUserSingle){
            Content();
            ContentDocument doc = [SELECT Id, Title FROM ContentDocument WHERE CreatedbyId = :tempUserSingle.Id ORDER BY CreatedDate DESC LIMIT 1];
            System.debug('doc: ' + doc);
            system.assertEquals(doc, afTrainerInfoController.getFile(tempUserSingle.Id));
            
        }


        //Bulk input Testing
        //Obtain all users.
        LIST<User> tempUserBulk = [SELECT id FROM User WHERE LastName LIKE 'last%'];
        
        for(integer i=0; i<20; i++){
            System.runAs(tempUserBulk[i]){
                //Generate a new contentVersion. This in turn will generate a new content document.
                ContentVersion cont = new ContentVersion(Title = 'Penguins'+i,
                                                         PathOnClient = 'Penguins'+i+'.jpg',
                                                         VersionData = Blob.valueOf('Test Content'),
                                                         IsMajorVersion = true);
                insert cont;

                //Used to display purposes
                ContentDocument docTest = ([SELECT Title, createdbyid FROM ContentDocument WHERE CreatedbyId = :tempUserBulk[i].Id ORDER BY CreatedDate DESC LIMIT 1]);
                ContentDocument docu = ([SELECT Id, Title FROM ContentDocument WHERE CreatedbyId = :tempUserBulk[i].Id ORDER BY CreatedDate DESC LIMIT 1]);
                //Used to compare the current user id with the document created by id
                //Successful run if both id's are identical
                System.debug('User Id: ' + tempUserBulk[i]);
                System.debug('doc: ' + docTest);
                System.assertEquals(docu, afTrainerInfoController.getFile(tempUserBulk[i].Id));
            }
        }
        Test.stopTest();
    }
	
    //This method creates a new ContentVersion which creates a contentDocument, which we need inorder to test the class
    public static void Content(){
        ContentVersion cont = new ContentVersion(
            Title = 'Penguins'+1,
            PathOnClient = 'Penguins'+1+'.jpg',
            VersionData = Blob.valueOf('Test Content'+1),
            IsMajorVersion = true
        );
        insert cont;
    }
}