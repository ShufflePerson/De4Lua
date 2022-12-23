import luaparse from 'luaparse'
import get_variable_declaration from './get_variable_declaration';


function iterate(statement: any, var_declaration: luaparse.LocalStatement) {

    //Boilerplate code, hopefully this will be a MACRO in the future
    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement, var_declaration));
    
        
    //If the statement is a variable declaration, and it is the variable declaration we are looking for
    if (statement.type == "LocalStatement" && statement == var_declaration) {

        //Remove the variable declaration
        return {
            type: "EmptyStatement"
        }
    }

    return statement;
}


export default ((chunk: luaparse.Chunk, varname: string): luaparse.Chunk => {
    //Get the variable declaration
    let var_declaration = get_variable_declaration(varname, chunk);
    //If the variable is null, return null
    if (!var_declaration) return chunk;
    
    //Iterate through the chunk and return the latest assignment
    let newchunk = iterate(chunk, var_declaration);

    return newchunk;
})