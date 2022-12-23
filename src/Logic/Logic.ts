import luaparse from 'luaparse';

//Utils
import DumpStrings from './Dump/DumpStrings';

//Imports Static Deobfucation Methods
import CalculateMath from './Static/CalculateMath';
import OpenLoadstring from './Static/OpenLoadstring';
import RemoveGarbage from './Static/RemoveGarbage';
import RemoveHexStrings from './Static/RemoveHexStrings';
import RemoveUnUsed from './Static/RemoveUnUsed';
import RenameLocalGlobals from './Static/RenameLocalGlobals';


function logic(chunk: luaparse.Chunk, cycles: number = 0): luaparse.Chunk {
    console.log(`[+] Logic cycle ${cycles}`)

    let newchunk: luaparse.Chunk;
    
    //Calls all of the deobfucation methods.
    //As stated in the README, TODO: Configs, so you can toggle on and off differnt deobfuscation methods
    newchunk = RenameLocalGlobals(chunk)
    newchunk = CalculateMath(newchunk)
    newchunk = RemoveGarbage(newchunk)
    newchunk = RemoveUnUsed(newchunk)
    newchunk = RemoveHexStrings(newchunk)
    newchunk = OpenLoadstring(newchunk)

    //If there are more cycles, call the logic function again.
    if (cycles > 0) {
        newchunk = logic(newchunk, cycles - 1);
    }

    //Returns the new chunk.
    return newchunk;
}

export default ((chunk: luaparse.Chunk, cycles: number = 0): luaparse.Chunk => {
    //Calls the Logic function.
    //Cycles are needed incase deobfucased code has more obfucation.
    //Todo: a check if last cycle was the same as the current cycle.
    let result = logic(chunk, cycles);

    //This is work in progress, but end goal is to dump the available strings without having to run the code.
    let str_dump = DumpStrings(result);

    return result;
})