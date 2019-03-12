public class afNewTrainingTrackTriggerHelper {

    public static void generateBatchColor(List<Training_Track__c> track)
    {
        final String colorHex = '0123456789ABCDEF';
        for(Training_Track__c t : track){
            String newBatchColor ='#';
        for(Integer i = 0; i < 6; i++)
        {
            Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), colorHex.length());
            newBatchColor += colorHex.substring(idx, idx+1);
        }
        if(newBatchColor == '#FFFFFF' || newBatchColor =='#000000'){
            generateBatchColor(track);
        }
        else{
            	t.Color__c = newBatchColor;
        	}
        }
    }
}