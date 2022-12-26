import luaparse from 'luaparse'
import get_variable_declaration from '../utils/get_variable_declaration';
import remove_variable_declaration from '../utils/remove_variable_declaration';
import { set_iterate_body, set_iterate_types } from './../iterate';


let removed_variables: string[] = [];

function iterate(statement: any, chunk: luaparse.Chunk): any {
    

    statement = set_iterate_body(statement, iterate, chunk);

    
    if (statement.type == "CallStatement" && statement.expression.type == "CallExpression") {
       statement.expression.base = (iterate(statement.expression.base, chunk));
    }

    //If the statement is a variable
    if (statement.type == "Identifier") {
        //Get the variable declaration
        let found = get_variable_declaration(statement.name, chunk);

        //If the variable is found, and the value of its is a variable
        if (found as any != chunk && found && found.init[0].type == "Identifier") {
            //Remove the original variable
            removed_variables.push(statement.name);

            //Replace the variable with the variable it is assigned to
            return {
                type: "Identifier",
                name: (found.init[0]).name
            }
        }
    }


    return statement;
}

function RenameLocalGlobals(chunk: luaparse.Chunk): luaparse.Chunk {
    //This deobfucasion method replaces all local variables that are assigned to a global variable with the global variable with the global variable
    //For example:
    //local abc = print
    //abc("Hello World")
    //becomes
    //print("Hello World")

    //Calls the iterate function
    let newchunk = iterate(chunk, chunk);

    //The variables are no longer needed as they are replaced with the global variable.
    //So we can remove them
    for (let i = 0; i < removed_variables.length; i++) {
        newchunk = remove_variable_declaration(newchunk, removed_variables[i]);
    }

    return newchunk;
}



export default RenameLocalGlobals;