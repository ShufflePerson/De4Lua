import luaparse from 'luaparse'
import { t_Loc } from '../types/t_loc';
import get_variable_deeclaration from './get_variable_declaration';


function iterate(statement: any, var_declaration: luaparse.LocalStatement, stopAtLine: t_Loc | null, current_latest_assignment: luaparse.AssignmentStatement| null = null): luaparse.AssignmentStatement | null {
    

    //if statement has a body, iterate through it
    if (statement.body) {
        for (let i = 0; i < statement.body.length; i++)
        {
            //gets the statement that declares the variable
            let result = iterate(statement.body[i], var_declaration, stopAtLine, current_latest_assignment);

            //if result is not null, return it
            if (result) {
                return result;
            }
        }
    }

    
    //if the statement is a reassignment of the variable
    if (statement.type == "AssignmentStatement") {
        //if the variable name is the same as the variable name we are looking for
        if (statement.variables[0].name == var_declaration.variables[0].name) {

            //Check if we are restricting the search to a certain line
            if (stopAtLine) {
                //If the line is less than or equal to the line we are looking for, set the current_latest_assignment to the statement
                if (statement.loc.start.line <= stopAtLine.start.line) {
                    current_latest_assignment = statement;
                }
            } else {
                //If we are not restricting the search to a certain line, set the current_latest_assignment to the statement
                current_latest_assignment = statement;
            }
        }
    }


    return current_latest_assignment;
}

export default ((chunk: luaparse.Chunk, varname: string, stopAtLine: t_Loc | null  = null): luaparse.AssignmentStatement | null => {
    if (stopAtLine) {
        stopAtLine.start.line = stopAtLine.start.line - 1;
    }

    //Get the variable declaration
    let variable = get_variable_deeclaration(varname, chunk)
    //If the variable is null, return null
    if (!variable) return null;
    
    //Iterate through the chunk and return the latest assignment
    let latest_assignment = iterate(chunk, variable, stopAtLine);


    //If the latest assignment is not null, return it
    if (latest_assignment) {
        return latest_assignment;
    }


    return null;
})