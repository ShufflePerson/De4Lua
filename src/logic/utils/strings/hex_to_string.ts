//Converts a string of hex values to a string of characters
export default ((str: string) => {
    //Initlize the new string
    let newstr = "";
    //Split the string by the backslash
    let split = str.split("\\");

    //Remove the first element, which is a blank string
    split.shift();

    //Iterate through the array and convert each hex value to a character
    split.forEach((char) => {
        newstr += String.fromCharCode(parseInt(char));
    })

    return newstr;
})