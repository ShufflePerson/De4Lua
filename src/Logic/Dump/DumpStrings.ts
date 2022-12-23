import luaparse from 'luaparse';


type t_var = {
    value: string
}[]


function iterate(statement: any, out: t_var): luaparse.Chunk {
    
    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement, out));
    if (statement.expression)
        statement.expression = iterate(statement.expression, out);
    if (statement.base && statement.base.arguments)
        statement.base.arguments = statement.base.arguments.map((statement: any) => iterate(statement, out));
    if (statement.init)
        statement.init = statement.init.map((statement: any) => iterate(statement, out));

    
    if (statement.type == "StringLiteral") {
        out.push({
            value: statement.raw
        })
    }

    return statement;
}

export default ((chunk: luaparse.Chunk): t_var => {
    let out: t_var = [];
    iterate(chunk, out)
    return out;
});