/*
This class acts as a controller which will allow the user to upload a resume
*/
public class afTrainerInfoController {
    public Boolean fileUploadProcessed{get;set;}
    public String message{get;set;}
    public String messageType{get;set;}
    public transient Attachment objAttachment;

    /*
    This method is used to get the Resume object and allow it to be transient
    */
    public Attachment getAttachment(){
        objAttachment = new Attachment();
        return objAttachment;
    }

    /*
    This method tries to upload the file and then updates the  message and messageType
    accordingly
    */
    public void uploadFile(){
        try {
            objAttachment.ParentId = (Id) ApexPages.currentPage().getParameters().get('id');

            insert objAttachment;

            message = 'File was uploaded successfully';
            messageType = 'success';
        }catch(Exception e){
            message = e.getMessage();
            messageType = 'error';
        }
        fileUploadProcessed = true;
    }

    /*
    This method queries the database to get the information about the trainer
    that is passed in the userId parameter
    */
    @AuraEnabled
    public static ContentDocument getFile(Id userId){
        return [SELECT Id, Title FROM ContentDocument WHERE CreatedbyId = :userId ORDER BY CreatedDate DESC LIMIT 1];
    }
}