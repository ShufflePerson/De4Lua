import luaparse from 'luaparse'
import { t_types } from '../../ast/builder/types/t_types';




//This function checks if the if statement has any non if statements in it
//This is needed as the other statements are not supported yet
function has_non_if_statement(statements: any) {
    for (let i = 0; i < statements.length; i++) {
        if (statements[i].type != t_types.IF_CLAUSE) {
            return true;
        }
    }
    return false;
}


function iterate(statement: any, parent: any = {}) {
    

    //boilerplate which hopefully will be a MACRO in the future
    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement, statement));


    //If our current statement has clauses 
    if (statement.clauses) {
        //If the if statement has no non if statements in it, iterate through the clauses
        //Otherwise, log out a warning
        if (!has_non_if_statement(statement.clauses))
            statement.clauses = statement.clauses.map((statement: any) => iterate(statement, statement));
        else
            console.warn("[*] [Not-Supported] If statement has non if statement in it, this is not supported yet")

        //If the statement is a empty statement, remove it
        statement.clauses = statement.clauses.filter((statement: any) => {
            return statement.type != t_types.EMPTY_STATEMENT
        })

        //If the statement has no clauses, remove it
        if (statement.clauses.length == 0) {
            statement = {
                type: t_types.EMPTY_STATEMENT
            }
        }
    }

    //If the statement is a condition check and the condition is a boolean
    if (statement.condition && statement.condition.type == t_types.BOOLEAN_LITERAL) {
        //If the condition is false, remove the entire statment 
        if (statement.condition.value == false) {
            statement = {
                type: t_types.EMPTY_STATEMENT
            }
        } else {
            //else if it is true, remove the condition and set the statement to the body
            statement = {
                type: t_types.CHUNK,
                body: statement.body
            };
        }
    }


    //If statment has clauses
    if (statement.clauses) {
        //We change each clause
        statement.clauses = statement.clauses.map((_statement: any) => {
            //If the condition is a boolean literal
            if (_statement.condition && _statement.condition.type == t_types.BOOLEAN_LITERAL) {
                //If the value is true, we set the statement to the body
                if (_statement.condition.value == true) {
                    statement = {
                        type: t_types.CHUNK,
                        body: _statement.body
                    }
                }
            }
            return _statement;
        });
    }


    return statement;
}

export default ((chunk: luaparse.Chunk): luaparse.Chunk => {
    chunk = iterate(chunk)

    return chunk;
})