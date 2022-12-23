//This functions checks if a string is hex
export default ((str: string): boolean => {
    //Initlize the boolean
    let is_hex: boolean = false;

    //If the string matches the regex, it is hex
    if (str.match(/\\[0-9]{3}/g)) {
        is_hex = true;
    }

    return is_hex;
})