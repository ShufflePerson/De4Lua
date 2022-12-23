import luaparse from 'luaparse'


export function fromCode(code: string) {
  // Parse the code into an AST
  //Do NOT remove "locations: true" as this will break Logic.
  return luaparse.parse(code, {
    comments: false,
    locations: true,
    scope: true,
    ranges: false,
    luaVersion: '5.1',
  })
}