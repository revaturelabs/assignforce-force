/*
 *  afNewTrainingTrackTriggerHelper
 *  -Helper Class for the TrainingTrack Trigger
 *  -Populates the Color__c field for the TrainingTracks Objects on insert
 */


public class afNewTrainingTrackTriggerHelper {

    /*
     *generateBatchColor Helper Method
     * -Generates a random hex code
     * -Assigns this hex code to a training track
     * -Does this for all training tracks passed in from the Trigger
    */
    public static void generateBatchColor(List<Training_Track__c> track)
    {
        final String colorHex = '0123456789ABCDEF'; //Contains all hex digits
        String newBatchColor; //will hold the hexcode to be assigned to track

        //Loop through all of the tracks passed into the method
        for(Training_Track__c t : track) {

            //Do while will repeat until the generated hexcode is NEITHER Solid Black NOR Solid White
            do {
                newBatchColor ='#';
                
                //Generate 6 random indices and add that character from the String above
                //to the newBatchColor String
                for(Integer i = 0; i < 6; i++) {
                    Integer idx = Math.mod(Math.abs(Crypto.getRandomInteger()), colorHex.length());
                    newBatchColor += colorHex.substring(idx, idx+1);
                }

            } while (newBatchColor == '#FFFFFF' || newBatchColor == '#000000');

            //Assigns the color for the current training track to the randomly generated one
            t.Color__c = newBatchColor;
        }
    }
}