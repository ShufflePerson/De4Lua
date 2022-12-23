import luaparse from 'luaparse'



//This function checks if the if statement has any non if statements in it
//This is needed as the other statements are not supported yet
function has_non_if_statement(statements: any) {
    for (let i = 0; i < statements.length; i++) {
        if (statements[i].type != "IfStatement") {
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
            iterate(statement, statement.clauses)
        else
            console.warn("[*] [Not-Supported] If statement has non if statement in it, this is not supported yet")
    }

    //If the statement is an if statement, iterate through the clauses
    if (statement.condition && statement.condition.type == "BooleanLiteral") {
        //If the condition is false, remove the if statement from the AST (code)
        if (statement.condition.value == false) {
            statement = {
                type: "EmptyStatement"
            }
        }
    }

    return statement;
}

export default ((chunk: luaparse.Chunk): luaparse.Chunk => {
    chunk = iterate(chunk)

    return chunk;
})