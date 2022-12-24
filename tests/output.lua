--This code has been deobfucated by De4Lua
--The code might not be valid, if there are any issues report them to the Issues section of the Github page.
--Github: https://github.com/ShufflePerson/De4Lua

local v0 = 122447
v0 = 122570
local v1 = 1203456
local v2 = 1230471
local v3 = 8023481
print("true")
print("obfuscate the conditions!")
print("Clicking [Strings] will completely hide this string!")
do
    function sieve_of_eratosthenes(v5)
        local v8 = {}
        for v9 = 1, v5 do
            v8[v9] = 1 ~= v9
        end
        for v11 = 2, math.floor(math.sqrt(v5)) do
            if v8[v11] then
                for j = v11 * v11, v5 do
                    v8[j] = false
                end
            end
        end
        return v8
    end
    local v4 = sieve_of_eratosthenes(420)
    for v6, v7 in pairs(v4) do
        if v7 then
            print("Prime found: " .. v6)
        end
    end
end
print("How to obfuscate best?")
