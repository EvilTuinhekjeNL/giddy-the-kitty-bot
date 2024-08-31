export const areEqual = function(string1, string2){
    if(!string1 || !string2){
        return false;
    }
    return string1.toUpperCase() === string2.toUpperCase();
}