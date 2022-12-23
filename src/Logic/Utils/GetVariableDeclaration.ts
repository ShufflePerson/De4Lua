import luaparse from 'luaparse';




//This function will iterate through the ast and return the statement that declares the variable
function iterate(statement: any, variableName: string): any {
    
    //if statement has a body, iterate through it
    if (statement.body) {
        for (let i = 0; i < statement.body.length; i++) {
            //gets the statement that declares the variable
            let found = iterate(statement.body[i], variableName);

            //if the statement is a variable and the variable name is the same as the variable name we are looking for
            //return the found variable
            if(found && found.type == "LocalStatement" && found.variables[0].name == variableName) {
                return found;
            }
        }
    }


    return statement;
}



export default ((variableName: string, chunk: luaparse.Chunk): luaparse.LocalStatement | undefined => {
    let variable = iterate(chunk, variableName);

    //if the variable is the chunk, it means we failed to find it hence we return undefined
    if (variable as any == chunk)
        return undefined;
    else 
        return variable as luaparse.LocalStatement;
})