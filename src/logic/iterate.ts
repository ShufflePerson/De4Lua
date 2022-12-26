

//This file contains the functions for iterating through the AST
//I feel like this is needed as all of the deobfuscation methods iterate through the AST with almost the same code


export function set_iterate_body(statment: any, iterate: Function,...args: any) {
    if (statment.body) {
        statment.body = statment.body.map((statement: any) => iterate(statement, ...args));
    }
    return statment;
}

export function iterate_body(statment: any, iterate: Function, ...args: any) {
    if (statment.body) {
       iterate(statment.body, ...args); 
    }
}


export function set_iterate_expression(statment: any, iterate: Function, ...args: any) {
    if (statment.expression) {
        statment.expression = iterate(statment.expression, ...args);
    }
    return statment;
}

export function iterate_expression(statment: any, iterate: Function, ...args: any) {
    if (statment.expression) {
        iterate(statment.expression, ...args);
    }
}

export function set_iterate_types(statment: any, iterate: Function, types: Array<string>, ...args: any) {
    if (statment.type) {
        if (types.includes(statment.type)) {
            statment = iterate(statment, ...args);
        }
    }
    return statment;
}

export function iterate_types(statment: any, iterate: Function, types: Array<string>, ...args: any) {
    if (statment.type) {
        if (types.includes(statment.type)) {
            iterate(statment, ...args);
        }
    }
}


export function set_iterate_init(statment: any, iterate: Function, ...args: any) {
    if (statment.init) {
        statment.init = statment.init.map((statement: any) => iterate(statement, ...args));
    }
    return statment;
}

export function iterate_init(statment: any, iterate: Function, ...args: any) {
    if (statment.init) {
        iterate(statment.init, ...args);
    }
}

export function set_iterate_base_arguments(statment: any, iterate: Function, ...args: any) {
    if (statment.base && statment.base.arguments) {
        statment.base.arguments = statment.base.arguments.map((statement: any) => iterate(statement, ...args));
    }
    return statment;
}

export function iterate_base_arguments(statment: any, iterate: Function, ...args: any) {
    if (statment.base && statment.base.arguments) {
        iterate(statment.base.arguments, ...args);
    }
}