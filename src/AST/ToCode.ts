import luaparse from 'luaparse'


//this file is undocumented, whilist it is a bit old as I coded this for another Project a while ago, it still works and is flexible enough to be used in this project.

//Feel free to refactor this file

export namespace ASTHandlers {
    let output = "";
    export let orgchunk: luaparse.Chunk;

    let logged_unsupported: Array<string> = []


    export enum TYPES {
        CHUNK = "Chunk",
        LOCAL_STATEMENT = "LocalStatement",
        IDENTIFIER = "Identifier",
        STRING_LITERAL = "StringLiteral",
        CALL_STATEMENT = "CallStatement",
        CALL_EXPRESSION = "CallExpression",
        FOR_NUMERIC_STATEMENT = "ForNumericStatement",
        NUMERIC_LITERAL = "NumericLiteral",
        ASSIGNMENT_STATEMENT = "AssignmentStatement",
        BINARY_EXPRESSION = "BinaryExpression",
        FUNCTION_DECLRATION = "FunctionDeclaration",
        RETURN_STATEMENT = "ReturnStatement",
        MEMBER_EXPRESSION = "MemberExpression",
        BOOLEAN_LITERAL = "BooleanLiteral",
        WHILE_STATEMENT = "WhileStatement",
        FOR_GENERIC_STATEMENT = "ForGenericStatement",
        IF_STATEMENT = "IfStatement",
        IF_CLAUSE = "IfClause",
        ELSEIF_CLAUSE = "ElseifClause",
        ELSE_CLAUSE = "ElseClause",
        UNARY_EXPRESSION = "UnaryExpression",
        TABLE_CALL_EXPRESSION = "TableCallExpression",
        LOGICAL_EXPRESSION = "LogicalExpression",
        VAR_ARG_LITERAL = "VarargLiteral",
        TABLE_CONSTRUCTOR_EXPRESSION = "TableConstructorExpression",
        TABLE_KEY_STRING = "TableKeyString",
        TABLE_VALUE = "TableValue",
        TABLE_KEY = "TableKey",
        INDEX_EXPRESSION = "IndexExpression",
        NIL_LITERAL = "NilLiteral",
        BREAK_STATEMENT = "BreakStatement",
        DO_STATEMENT = "DoStatement",
        REPEAT_STATEMENT = "RepeatStatement",
        EMPTY_STATEMENT = "EmptyStatement",
    }

    function log_type(type: TYPES) {
        console.log(`{ ${type} }`)
    }

    export function get_fn_body(fn: string) {
        let _statement;
        orgchunk.body.forEach((statement) => {
            if (statement.type == TYPES.FUNCTION_DECLRATION && statement.identifier?.type == TYPES.IDENTIFIER && statement.identifier.name == fn)
                _statement = statement;
        })

        return _statement;
    }

    export function handle(cn: any): string {
        if (!cn) return `Provided {${cn}} which does not have a "type" propety`

        //log_type(cn.type);


        switch (cn.type) {
            case TYPES.CHUNK:
                orgchunk = cn;
                chunk(cn);
                break;
            case TYPES.LOCAL_STATEMENT:
                local_statement(cn)
                break;
            case TYPES.IDENTIFIER:
                output += cn.name;
                break;
            case TYPES.STRING_LITERAL:
                output += cn.raw;
                break;
            case TYPES.CALL_STATEMENT:
                call_statement(cn);
                break;
            case TYPES.CALL_EXPRESSION:
                call_expression(cn);
                break;
            case TYPES.FOR_NUMERIC_STATEMENT:
                ForNumericStatement(cn);
                break;
            case TYPES.NUMERIC_LITERAL:
                NumericLiteral(cn);
                break;
            case TYPES.ASSIGNMENT_STATEMENT:
                AssignmentStatement(cn);
                break;
            case TYPES.BINARY_EXPRESSION:
                BinaryExpression(cn)
                break;
            case TYPES.FUNCTION_DECLRATION:
                FunctionDeclaration(cn);
                break;
            case TYPES.RETURN_STATEMENT:
                ReturnStatement(cn);
                break;
            case TYPES.MEMBER_EXPRESSION:
                MemberExpression(cn);
                break;
            case TYPES.BOOLEAN_LITERAL:
                BooleanLiteral(cn);
                break;
            case TYPES.WHILE_STATEMENT:
                WhileStatement(cn);
                break;
            case TYPES.FOR_GENERIC_STATEMENT:
                ForGenericStatement(cn);
                break;
            case TYPES.IF_STATEMENT:
                IfStatement(cn);
                break;
            case TYPES.IF_CLAUSE:
                IfClause(cn);
                break;
            case TYPES.ELSEIF_CLAUSE:
                ElseifClause(cn);
                break;
            case TYPES.ELSE_CLAUSE:
                ElseClause(cn);
                break;
            case TYPES.UNARY_EXPRESSION:
                UnaryExpression(cn);
                break;
            case TYPES.TABLE_CALL_EXPRESSION:
                TableCallExpression(cn);
                break;
            case TYPES.LOGICAL_EXPRESSION:
                LogicalExpression(cn);
                break;
            case TYPES.VAR_ARG_LITERAL:
                VarargLiteral(cn);
                break;
            case TYPES.TABLE_CONSTRUCTOR_EXPRESSION:
                TableConstructorExpression(cn);
                break;
            case TYPES.TABLE_KEY_STRING:
                TableKeyString(cn);
                break;
            case TYPES.TABLE_VALUE:
                TableValue(cn);
                break;
            case TYPES.TABLE_KEY:
                TableKey(cn);
                break;
            case TYPES.INDEX_EXPRESSION:
                IndexExpression(cn);
                break;
            case TYPES.NIL_LITERAL:
                NilLiteral(cn);
                break;
            case TYPES.BREAK_STATEMENT:
                BreakStatement(cn);
                break;
            case TYPES.DO_STATEMENT:
                DoStatement(cn);
                break;
            case TYPES.REPEAT_STATEMENT:
                RepeatStatement(cn);
                break;
            case TYPES.EMPTY_STATEMENT:
                break;
            default:
                if (!logged_unsupported.includes(cn.type)) {
                    console.warn(`${cn.type} is not supported!`);
                    logged_unsupported.push(cn.type)
                }
                break;
        }

        return output;
    }

    function chunk(cn: luaparse.Chunk) {
        for (let i = 0; i < cn.body.length; i++)
            handle(cn.body[i] /*false*/)
    }

    function local_statement(cn: luaparse.LocalStatement) {
        output += "local "
        for (let i = 0; i < cn.variables.length; i++) {
            const variable = cn.variables[i];

            handle(variable);

            if (i != cn.variables.length - 1)
                output += ", ";
        }

        if (cn.init.length != 0) {
            output += " = ";
            for (let i = 0; i < cn.init.length; i++) {
                const init = cn.init[i];
                handle(init /*false*/);

                if (i != cn.init.length - 1)
                    output += ", ";
            }
        }

        output += ";\n"
    }

    function call_statement(cn: luaparse.CallStatement) {
        handle(cn.expression);
    }

    function call_expression(cn: luaparse.CallExpression) {
        handle(cn.base);
        output += "(";

        for (let i = 0; i < cn.arguments.length; i++) {
            const arg = cn.arguments[i];
            handle(arg /*false*/);

            if (i != cn.arguments.length - 1)
                output += ", o"
        }

        output += ")\n"
    }

    function ForNumericStatement(cn: luaparse.ForNumericStatement) {
        output += "for ";
        handle(cn.variable /*false*/)
        output += " = "
        handle(cn.start /*false*/);
        output += ", "
        handle(cn.end /*false*/);
        output += " do\n"
        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
        }
        output += "\nend\n";
    }

    function NumericLiteral(cn: luaparse.NumericLiteral) {
        output += cn.value;
    }

    function AssignmentStatement(cn: luaparse.AssignmentStatement) {

        for (let i = 0; i < cn.variables.length; i++) {
            const variable = cn.variables[i];
            handle(variable /*left*/);

            if (i != cn.variables.length - 1)
                output += ", ";
        }

        output += " = "
        for (let i = 0; i < cn.init.length; i++) {
            const init = cn.init[i];
            handle(init);

            if (i != cn.init.length - 1)
                output += ", "
        }
        output += "\n"
    }

    function BinaryExpression(cn: luaparse.BinaryExpression) {
        handle(cn.left /*true*/);
        output += ` ${cn.operator} `;
        handle(cn.right /*true*/);
    }

    function FunctionDeclaration(cn: luaparse.FunctionDeclaration) {
        if (cn.isLocal)
            output += "local "
        output += "function ";
        handle(cn.identifier /*false*/);
        output += "("

        for (let i = 0; i < cn.parameters.length; i++) {
            const par = cn.parameters[i];
            handle(par /*false*/);

            if (i != cn.parameters.length - 1)
                output += ", ";
        }

        output += ")\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i] /*false*/);
        }

        output += "end\n";

    }


    function ReturnStatement(cn: luaparse.ReturnStatement) {
        output += "return ";

        for (let i = 0; i < cn.arguments.length; i++) {
            handle(cn.arguments[i]);

            if (i != cn.arguments.length - 1)
                output += ", ";
        }

        output += "\n";
    }

    function MemberExpression(cn: luaparse.MemberExpression) {

        handle(cn.base /*false*/);
        if (cn.indexer)
            output += cn.indexer;
        else if (cn.base.type == "MemberExpression")
            output += cn.base.indexer;
        handle(cn.identifier /*false*/);
    }

    function BooleanLiteral(cn: luaparse.BooleanLiteral) {
        output += cn.value;
    }

    function WhileStatement(cn: luaparse.WhileStatement) {
        output += "while ";
        handle(cn.condition);
        output += " do\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
        }

        output += "end\n";
    }

    function ForGenericStatement(cn: luaparse.ForGenericStatement) {
        output += "for ";
        for (let i = 0; i < cn.variables.length; i++) {
            const variable = cn.variables[i];
            handle(variable /*false*/);

            if (i != cn.variables.length - 1)
                output += ", ";
        }

        output += " in ";

        for (let i = 0; i < cn.iterators.length; i++) {
            const iterator = cn.iterators[i];
            handle(iterator /*false*/);

            if (i != cn.iterators.length - 1)
                output += ", ";
        }

        output += " do\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
        }

        output += "end\n";
    }

    function IfStatement(cn: luaparse.IfStatement) {
        output += "if ";
        cn.clauses.forEach((clause, i) => {
            handle(clause);
        });

        output += "end\n"
    }

    function IfClause(cn: luaparse.IfClause) {
        handle(cn.condition);
        output += " then\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
            output += "\n";
        }
    }

    function ElseifClause(cn: luaparse.ElseifClause) {
        output += "elseif ";
        handle(cn.condition);
        output += " then\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
            output += "\n";
        }

    }

    function ElseClause(cn: luaparse.ElseClause) {
        output += "else\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
            output += "\n";
        }
    }

    function UnaryExpression(cn: luaparse.UnaryExpression) {
        output += cn.operator;
        handle(cn.argument);
    }

    function TableCallExpression(cn: luaparse.TableCallExpression) {
        console.log("NOT SUPPORT")
    }

    function LogicalExpression(cn: luaparse.LogicalExpression) {
        handle(cn.left);
        output += ` ${cn.operator} `;
        handle(cn.right);
    }


    function VarargLiteral(cn: luaparse.VarargLiteral) {
        output += "...";
    }

    function TableConstructorExpression(cn: luaparse.TableConstructorExpression) {
        output += "{";
        let add_brackets = true;

        for (let i = 0; i < cn.fields.length; i++) {
            const field = cn.fields[i];
            add_brackets = true || field.type == TYPES.TABLE_VALUE && (field.value.type == TYPES.VAR_ARG_LITERAL || field.value.type == TYPES.TABLE_CONSTRUCTOR_EXPRESSION);

            if (add_brackets) {
                if (i == 0) {
                    output = output.slice(0, -1);
                    output += "({";
                } else {
                   // output += "("
                }

            }


            handle(field);


           // if (add_brackets && i != 0) 
                //output += ")";
            
            if (i != cn.fields.length - 1)
                output += ", ";
        }

        output += add_brackets ? "})" : "}";
    }

    function TableKeyString(cn: luaparse.TableKeyString) {
        handle(cn.key);
        output += " = ";
        handle(cn.value);
    }

    function TableKey(cn: luaparse.TableKey) {
        output += "[";
        handle(cn.key);
        output += "] = ";
        handle(cn.value);
    }

    function TableValue(cn: luaparse.TableValue) {
        handle(cn.value);
    }

    function IndexExpression(cn: luaparse.IndexExpression) {
        handle(cn.base);
        output += "[";
        handle(cn.index);
        output += "]";
    }

    function NilLiteral(cn: luaparse.NilLiteral) {
        output += "nil";
    }

    function BreakStatement(cn: luaparse.BreakStatement) {
        output += "break";
    }

    function DoStatement(cn: luaparse.DoStatement) {
        output += "do\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
        }

        output += "end\n";
    }

    function RepeatStatement(cn: luaparse.RepeatStatement) {
        output += "repeat\n";

        for (let i = 0; i < cn.body.length; i++) {
            handle(cn.body[i]);
        }

        output += "until ";
        handle(cn.condition);
    }

}

export function ToCode(ast: luaparse.Chunk): string {
    let result = ASTHandlers.handle(ast);
    //console.log(JSON.stringify(ast, null, 4))


    //result = lua_fmt.formatText(result);
    return result;
}