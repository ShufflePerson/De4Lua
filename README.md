**IN DEVELOPMENT**

[De4Lua Playground](https://de4lua.art/)

# De4Lua Public

De4Lua is a open source LUA deobfuscator. It is written in NodeJS and is designed to be used as a CLI. It is currently in development and is not yet ready for production use.
I am hoping to one day intergrate this with [LuaDebugger](https://github.com/ShufflePerson/LuaDebugger) to allow for more advanced debugging & deobfuscation.

## Contributing

Read the [Example.ts](https://github.com/ShufflePerson/De4Lua/blob/main/src/logic/static/example.ts) file to see how to add new deobfuscation methods. If you have any questions, feel free to ask on my discord.

Do **NOT** take the other files an a example, I am in process of refactoring them with better type and code system.

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
11. Implement Scope checks, to ensure you don't use a variable before it is defined and variables in wrong scopes.
12. Replace ";" with new lines
13. Recode the AST Builder, as it is currently very messy, doesn't support all syntax

## Known Bugs:

Please report any bugs to my discord, or make a new issue. I will try to fix them as soon as possible.

1. Some syntax is not yet supported, luraph syntax for example is not supported, by LuaParse and lua-fmt. I am working on my own forks of both of them to allow for this to be fixed
2. Math expressions aren't being calculated if they contain a variable due the is_re_assigned function not working properly

## Virtulization

De4Lua does **NOT** support virtualization. This means any code that uses virtualization will not be deobfuscated.
De-virtualization is planned for a future release, after the deobfuscator is stable and has the features I want.

## Installation

Go to the releases page and download the latest release. Extract the zip file and run `npm install` in the directory.

## Usage

De4Lua can be run using `npm run start`.
The default input/ouput is inside the tests folder, to specify your own, specify it after the command. For example, `npm run start myFile.lua myOutput.lua`

Before running, you have to build it at least once with the command `npm run build`. This will create a `dist` folder with the compiled code.


