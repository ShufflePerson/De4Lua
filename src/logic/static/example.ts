import luaparse from 'luaparse'
import { ast_handlers } from '../../ast/ToCode';


//This is a example file, which will teach you on how to write a deobfuscation method



function iterate(statement: any, chunk: luaparse.Chunk): any {

    //if the statement has a children named body, it will set each of the children to the result of the iterate function
    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement, chunk));

    
    //we can do anything with the statement here
    //This example will replace a local statement with a string with the value "Hello World" with a comment statement with the value "Hello World"
    if (statement.type == ast_handlers.TYPES.LOCAL_STATEMENT) {
        //we cast the statement to a local statement
        let local_statement = statement as luaparse.LocalStatement;

        //if the local statement is the type of string literal and the value is "Hello World"
        if (local_statement.init[0].type == "StringLiteral" && local_statement.init[0].value == "Hello World") {

            //we return a comment statement with the value "Hello World"
            return {
                type: "CommentStatement",
                comment: "Hello World"
            }
        }
    }

    //If input was (local x = "Hello World"), output will be (--Hello World)

    return statement;
}


//This is the main function, which will be called by the deobfuscator
export default ((chunk: luaparse.Chunk): luaparse.Chunk => {
    //we assign a new variable to the chunk, which will be returned
    //we do this because we do not want to modify the original chunk
    let newchunk = iterate(chunk, chunk);

    //This is a fix, which will be applied if the newchunk is not a chunk
    if (newchunk.type != "Chunk") {
        console.warn("Example.ts: New chunk is not a chunk, this should not occur. Applying a fix, which might not work.")
        newchunk = {
            type: "Chunk",
            body: [newchunk]
        }
    }

    return newchunk;
})



