import luaparse from 'luaparse'

//I deleted it all, needs a full rewrite

export default ((chunk: luaparse.Chunk) => {
    console.warn("[*] [Not-Supported] RemoveUnused is not supported yet, it will not remove any unused variables");
    return chunk;
})