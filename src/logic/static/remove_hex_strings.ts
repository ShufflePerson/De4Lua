import luaparse from 'luaparse'
import hex_to_string from '../utils/strings/hex_to_string';
import is_hex from '../utils/strings/is_hex';


function iterate(statement: any): luaparse.Chunk {
    
    //A ton of boierplate code, which hopefully will be a MACRO in the future
    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement));
    if (statement.expression)
        statement.expression = iterate(statement.expression);
    if (statement.base && statement.base.arguments)
        statement.base.arguments = statement.base.arguments.map((statement: any) => iterate(statement));
    if (statement.init)
        statement.init = statement.init.map((statement: any) => iterate(statement));

    
    //If the statement is a string
    if (statement.type == "StringLiteral") {
        //If the string is hex
        if (is_hex(statement.raw)) {
            //Convert it to a string
            let result = hex_to_string(statement.raw);

            //If the string contains a newline, then use a multiline string
            //Otherwise, use a normal string but with escaped quotes
            if (result.includes("\n")) {
                statement.raw = `[[\n${result}\n]]`;
            } else {
                statement.raw = `"${result.replace(/"/g, '\\"')}"`;
            }
        }
    }

    return statement;
}



export default ((chunk: luaparse.Chunk): luaparse.Chunk => {
    let newchunk = chunk;
    newchunk = iterate(chunk);
    return newchunk;
})