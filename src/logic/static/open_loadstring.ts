import luaparse from 'luaparse'


function iterate(statement: any) {

    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement));
        
    return statement;
}


export default ((chunk: luaparse.Chunk) => {
    console.warn(`[*] [Not-Supported] OpenLoadstring is not supported yet, it will not open any loadstring`)

    let newchunk = iterate(chunk);

    return newchunk;
})