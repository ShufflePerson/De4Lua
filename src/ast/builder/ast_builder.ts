import luaparse from 'luaparse'
import { t_types } from './types/t_types';


export namespace ast_builder {
    let output = "";
    export let orgchunk: luaparse.Chunk;
    let logged_unsupported: Array<string> = []


    function log_type(type: t_types) {
        console.log(`{ ${type} }`)
    }

    export function get_fn_body(fn: string) {
        let _statement;
        orgchunk.body.forEach((statement) => {
            if (statement.type == t_types.FUNCTION_DECLRATION && statement.identifier?.type == t_types.IDENTIFIER && statement.identifier.name == fn)
                _statement = statement;
        })

        return _statement;
    }

    export function handle(cn: any): string {
        if (!cn) return `Provided {${cn}} which does not have a "type" propety`

        //log_type(cn.type);


        switch (cn.type) {
            case t_types.CHUNK:
                if (!orgchunk)
                    orgchunk = cn;
                chunk(cn);
                break;
            case t_types.LOCAL_STATEMENT:
                local_statement(cn)
                break;
            case t_types.IDENTIFIER:
                output += cn.name;
                break;
            case t_types.STRING_LITERAL:
                output += cn.raw;
                break;
            case t_types.CALL_STATEMENT:
                call_statement(cn);
                break;
            case t_types.CALL_EXPRESSION:
                call_expression(cn);
                break;
            case t_types.FOR_NUMERIC_STATEMENT:
                ForNumericStatement(cn);
                break;
            case t_types.NUMERIC_LITERAL:
                NumericLiteral(cn);
                break;
            case t_types.ASSIGNMENT_STATEMENT:
                AssignmentStatement(cn);
                break;
            case t_types.BINARY_EXPRESSION:
                BinaryExpression(cn)
                break;
            case t_types.FUNCTION_DECLRATION:
                FunctionDeclaration(cn);
                break;
            case t_types.RETURN_STATEMENT:
                ReturnStatement(cn);
                break;
            case t_types.MEMBER_EXPRESSION:
                MemberExpression(cn);
                break;
            case t_types.BOOLEAN_LITERAL:
                BooleanLiteral(cn);
                break;
            case t_types.WHILE_STATEMENT:
                WhileStatement(cn);
                break;
            case t_types.FOR_GENERIC_STATEMENT:
                ForGenericStatement(cn);
                break;
            case t_types.IF_STATEMENT:
                IfStatement(cn);
                break;
            case t_types.IF_CLAUSE:
                IfClause(cn);
                break;
            case t_types.ELSEIF_CLAUSE:
                ElseifClause(cn);
                break;
            case t_types.ELSE_CLAUSE:
                ElseClause(cn);
                break;
            case t_types.UNARY_EXPRESSION:
                UnaryExpression(cn);
                break;
            case t_types.TABLE_CALL_EXPRESSION:
                TableCallExpression(cn);
                break;
            case t_types.LOGICAL_EXPRESSION:
                LogicalExpression(cn);
                break;
            case t_types.VAR_ARG_LITERAL:
                VarargLiteral(cn);
                break;
            case t_types.TABLE_CONSTRUCTOR_EXPRESSION:
                TableConstructorExpression(cn);
                break;
            case t_types.TABLE_KEY_STRING:
                TableKeyString(cn);
                break;
            case t_types.TABLE_VALUE:
                TableValue(cn);
                break;
            case t_types.TABLE_KEY:
                TableKey(cn);
                break;
            case t_types.INDEX_EXPRESSION:
                IndexExpression(cn);
                break;
            case t_types.NIL_LITERAL:
                NilLiteral(cn);
                break;
            case t_types.BREAK_STATEMENT:
                BreakStatement(cn);
                break;
            case t_types.DO_STATEMENT:
                DoStatement(cn);
                break;
            case t_types.REPEAT_STATEMENT:
                RepeatStatement(cn);
                break;
            case t_types.EMPTY_STATEMENT:
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
                output += ", "
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
        //table call expression
        handle(cn.base);
        output += ":";
        handle(cn.arguments);

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
            handle(field);


           // if (add_brackets && i != 0) 
                //output += ")";
            
            if (i != cn.fields.length - 1)
                output += ", ";
        }

        output += "}";
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

export function to_code(ast: luaparse.Chunk): string {
    let result = ast_builder.handle(ast);
    //console.log(JSON.stringify(ast, null, 4))


    //result = lua_fmt.formatText(result);
    return result;
}