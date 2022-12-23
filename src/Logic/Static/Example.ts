import luaparse from 'luaparse'

function iterate(statement: any, chunk: luaparse.Chunk): luaparse.Statement | luaparse.Chunk {

    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement, chunk));

    return statement;
}

export default ((chunk: luaparse.Chunk): luaparse.Chunk => {
    let newchunk = iterate(chunk, chunk);

    if (newchunk.type != "Chunk") {
        console.warn("Example.ts: New chunk is not a chunk, this should not occur. Applying a fix, which might not work.")
        newchunk = {
            type: "Chunk",
            body: [newchunk]
        }
    }

    return newchunk;
})



