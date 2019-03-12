public with sharing class afBatchesListViewTableExtension {

    public afBatchesListViewTableExtension(ApexPages.StandardSetController sc){
        sc.setPageSize(10);
    }
    
    public static System.PageReference cancel(){
        return null;
    }
    
}