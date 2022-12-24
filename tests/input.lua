local v0 = 16164 + (((3864 + 364101) - 274396) - 67600) + (190952 - 110638);
v0 = v0 + (113 - (26 + 67)) + (1219 - (119 + 997));
local v1 = 1203456;
local v2 = 1230471;
local v3 = 8023481;
if (v2 > v1) then print("true"); end
if ((1 + v3) > v2) then print("obfuscate the conditions!"); end
print("Clicking [Strings] will completely hide this string!");
do function sieve_of_eratosthenes(v5) local v8 = {}; for v9 = 1, v5 do v8[v9] = 1 ~= v9; end for v11 = 2, math.floor(math
    .sqrt(v5)) do if v8[v11] then for j = v11 * v11, v5, v11 do v8[j] = false; end end end return v8; end local v4 = sieve_of_eratosthenes(420); for v6, v7 in pairs(v4) do if v7 then print("Prime found: "
    .. v6); end end end
print("How to obfuscate best?");
