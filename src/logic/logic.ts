import luaparse from 'luaparse';

//utils
import dump_strings from './dump/dump_strings';

//Imports Static Deobfucation Methods
import calculate_math from './static/calculate_math';
import open_load_string from './static/open_loadstring';
import remove_garbage from './static/remove_garbage';
import remove_hex_strings from './static/remove_hex_strings';
import remove_un_used from './static/remove_un_used';
import rename_local_globals from './static/rename_local_globals';




function logic(chunk: luaparse.Chunk, cycles: number = 0): luaparse.Chunk {
    console.log(`[+] Logic cycle ${cycles}`)

    let newchunk: luaparse.Chunk = chunk;
    
    //Calls all of the deobfucation methods.
    //As stated in the README, TODO: Configs, so you can toggle on and off differnt deobfuscation methods
    newchunk = rename_local_globals(chunk)
    newchunk = calculate_math(newchunk)
    newchunk = remove_garbage(newchunk)
    newchunk = remove_un_used(newchunk)
    newchunk = remove_hex_strings(newchunk)
    newchunk = open_load_string(newchunk)

    //If there are more cycles, call the logic function again.
    if (cycles > 0) {
        newchunk = logic(newchunk, cycles - 1);
    }

    //Returns the new chunk.
    return newchunk;
}

export default ((chunk: luaparse.Chunk, cycles: number = 3): luaparse.Chunk => {
    //Calls the Logic function.
    //Cycles are needed incase deobfucased code has more obfucation.
    //Todo: a check if last cycle was the same as the current cycle.
    let result = logic(chunk, cycles);

    //This is work in progress, but end goal is to dump the available strings without having to run the code.
    let str_dump = dump_strings(result);

    return result;
})