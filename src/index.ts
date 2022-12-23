console.clear();


//AST Imports
import { fromCode } from "./ast/FromCode";
import { ToCode } from "./ast/ToCode";

//Node Imports
import fs from 'fs';


//utils Imports
import luaparse from 'luaparse';
import Logic from "./logic/logic";


//Lua-FMT Has no typescript definitions, so we have to use require instead of import.
//This is a temporary fix until I can find a better solution or implement my own formatting.
const luafmt = require("lua-fmt");


//These will be added to the top of the output file.
const deobfucasion_credit = `
    --This code has been deobfucated by De4Lua
    --The code might not be valid, if there are any issues report them to the Issues section of the Github page.
    --Github: https://github.com/ShufflePerson/De4Lua
    \n\n\n
`

function main() {
    //Default input and output files
    let input_file = "tests/input.lua";
    let output_file = "tests/output.lua";
    let cycles = 0;

    //If the user has specified input and output files, use those instead.
    if (process.argv.length > 2) {
        //Get the first and second arguments as the input and output files.
        input_file = process.argv[2];
        output_file = process.argv[3];

        //If the input file does not exist, throw a error and exit.
        if (!fs.existsSync(input_file)) {
            console.error("Input file does not exist.");
            return;
        }

        //If the user has specified a number of cycles, use that instead.
        if (process.argv[4])
            cycles = Number(process.argv[4]);
    }


    //Starts the timer to check how long it takes to deobfucate the code.
    console.time("Time");

    //Reads the file and converts it to an AST
    let code = fs.readFileSync(input_file, "utf-8");
    const ast = fromCode(code);

    //Runs the Logic on the AST then converts it back to code
    let deobfucased: luaparse.Chunk = Logic(ast, cycles);
    let output = ToCode(deobfucased);

    output = deobfucasion_credit + output;

    //If output formatting fails, it will just output the unformatted code.
    //Output formatting can fail if the output is invalid lua code.
    try {
        output = luafmt.formatText(output);
    } catch (ex) {
        output = "--WARNING: The Formatting Failed. This means there is a possible syntax error.\n\n\n" + output
        console.error("Failed to format output");
    }

    //If the code is too long, it will not display it in the console.
    if (output.length < 1000)
        console.log(output)
    else
        console.log("Output is too long to display in the console. Check the output file.")

    //Ends the timer and writes the output to the output file.
    console.timeEnd("Time");
    fs.writeFileSync(output_file, output);
}

main();

