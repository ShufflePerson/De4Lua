**IN DEVELOPMENT**

# De4Lua Public

De4Lua is a open source LUA deobfuscator. It is written in NodeJS and is designed to be used as a CLI. It is currently in development and is not yet ready for production use.
I am hoping to one day intergrate this with [LuaDebugger](https://github.com/ShufflePerson/LuaDebugger) to allow for more advanced debugging & deobfuscation.

## Todo:

If you have any feature requests, send them to my discord or make a new issue.

1. Inline functions: Make one line functions inline, and remove the function definition
2. Loadstring: If loadstring is loading code locally, or from a variable, replace the loadstring with the code
3. Inline Complex Functions: If a function is only called once, inline it. But this has to be careful, as the function could be called later on from obfucased code.
4. Remove If statements if they are always true and keep the code
5. Add Support for math calculating in function parameters
6. Detect and emulate decrypt, and other static functions as such.
7. Static string and other variable dumping
8. Configs, so you can toggle on and off differnt deobfuscation methods
9. Better Logging and Error Handling.
10. Try to drastically reduce the amount of "any" types used in the code. Sadly I have been using them a lot due to the nature of the project.

## Known Bugs:

Please report any bugs to my discord, or make a new issue. I will try to fix them as soon as possible.

1. Some syntax is not yet supported, luraph syntax for example is not supported, by LuaParse and lua-fmt. I am working on my own forks of both of them to allow for this to be fixed

## Virtulization

De4Lua does **NOT** support virtualization. This means any code that uses virtualization will not be deobfuscated.
De-virtualization is planned for a future release, after the deobfuscator is stable and has the features I want.

## Installation

Go to the releases page and download the latest release. Extract the zip file and run `npm install` in the directory.

## Usage

De4Lua can be run using `npm run start`.
The default input/ouput is inside the tests folder, to specify your own, specify it after the command. For example, `npm run start myFile.lua myOutput.lua`

Before running, you have to build it at least once with the command `npm run build`. This will create a `dist` folder with the compiled code.

## Credits

This Project has been Developed by Shuffle
Discord: Shuffle#4696
