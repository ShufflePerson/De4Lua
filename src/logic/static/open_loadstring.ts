import luaparse from 'luaparse'
import { set_iterate_body } from '../iterate';


function iterate(statement: any) {

    statement = set_iterate_body(statement, iterate);
        
    return statement;
}


export default ((chunk: luaparse.Chunk) => {
    console.warn(`[*] [Not-Supported] OpenLoadstring is not supported yet, it will not open any loadstring`)

    let newchunk = iterate(chunk);

    return newchunk;
})