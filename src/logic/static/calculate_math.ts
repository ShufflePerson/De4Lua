import luaparse from 'luaparse'


//utils
import get_variable_declaration from '../utils/get_variable_declaration';
import is_re_assigned from '../utils/is_re_assigned';

//types
import { t_statementReturn } from '../types/t_statementReturn';
import { t_types } from '../../ast/builder/types/t_types';

function get_side(statement: luaparse.BinaryExpression, chunk: luaparse.Chunk, side: "left" | "right"): luaparse.BinaryExpression {

    //Make sure the side we are working with is a variable
    if (statement[side].type == "Identifier") {
        //@ts-ignore // stupid ts
        //Check if the variable is reassigned
        let reassigned = is_re_assigned(chunk, get_variable_declaration(statement[side].name, chunk), statement[side].loc, statement)
        console.log(reassigned)

    } 

    return statement;

}



function calc(statement: luaparse.BinaryExpression | luaparse.Identifier, chunk: luaparse.Chunk): any {

    //Check if the statement is an variable, if it is return the original statement
    if (statement.type == "Identifier") {
        return statement;
    }

    //Get the left and right sides of the statement as numbers if possible
    statement = get_side(statement, chunk, "left");
    statement = get_side(statement, chunk, "right");



    //Check if the left and right sides are binary expressions
    //If they are, call the calc function on them
    if (statement.left.type == "BinaryExpression")
        statement.left = calc(statement.left, chunk);
    if (statement.right.type == "BinaryExpression")
        statement.right = calc(statement.right, chunk);


    //Decleare the raw statement that would replace the current statement
    let new_statement: t_statementReturn = {
        type: "NumericLiteral",
        value: null
    }





    //Check if the statement is a binary expression and the left and right sides are numbers
    if (statement.type == "BinaryExpression" && statement.left.type == "NumericLiteral" && statement.right.type == "NumericLiteral") {
        //To anyone suggesting to use eval, please don't. It's a bad idea.
        //Eval can introduce security issues and is generally a bad idea.
        //Check if the operator is a +, -, *, /, %, ^, ==, or ~=
        //If it matches, update our new_statement with the output of the operation
        if (statement.operator == "+") {
            new_statement.value = statement.left.value + statement.right.value;
        } else if (statement.operator == "-") {
            new_statement.value = statement.left.value - statement.right.value;
        } else if (statement.operator == "*") {
            new_statement.value = statement.left.value * statement.right.value;
        } else if (statement.operator == "/") {
            new_statement.value = statement.left.value / statement.right.value;
        } else if (statement.operator == "%") {
            new_statement.value = statement.left.value % statement.right.value;
        } else if (statement.operator == "^") {
            new_statement.value = statement.left.value ^ statement.right.value;
        } else if (statement.operator == "==") {
            new_statement.value = statement.left.value == statement.right.value;
            new_statement.type = "BooleanLiteral";
        } else if(statement.operator == "~=") {
            new_statement.value = statement.left.value != statement.right.value;
            new_statement.type = "BooleanLiteral";
        } else if (statement.operator == "<") {
            new_statement.value = statement.left.value < statement.right.value;
            new_statement.type = "BooleanLiteral";
        }
        else if (statement.operator == ">") {
            new_statement.value = statement.left.value > statement.right.value;
            new_statement.type = "BooleanLiteral";
        } else if (statement.operator == "<=") {
            new_statement.value = statement.left.value <= statement.right.value;
            new_statement.type = "BooleanLiteral";
        }
        else if (statement.operator == ">=") {
            new_statement.value = statement.left.value >= statement.right.value;
            new_statement.type = "BooleanLiteral";
        } else {
            //If the operator is not one of the above, log out a warning
            if(statement.loc)
                console.warn(`Unknown operator ${statement.operator} at ${statement.loc.start.line}:${statement.loc.start.column}`)
            else
                console.warn(`Unknown operator ${statement.operator}`)
        }
    }

    if (new_statement.type == "BooleanLiteral") {
        //temporary removal till I can figure out how to make it work
        return statement;
    }



    //If the new statement has a value, return it, otherwise return the original statement
    if(new_statement.value != null)
        return new_statement;
    else 
        return statement;
}



function iterate(statement: any, chunk: luaparse.Chunk) {


    //boilerplate code to iterate through the ast
    //will have a MACRO in the future
    if (statement.body)
        statement.body = statement.body.map((statement: any) => iterate(statement, chunk));
    if (statement.condition)
        statement.condition = iterate(statement.condition, chunk);
    if (statement.init)
        statement.init = statement.init.map((statement: any) => iterate(statement, chunk));
    if (statement.clauses)
        statement.clauses = statement.clauses.map((statement: any) => iterate(statement, chunk));
    if (statement.start)
        statement.start = iterate(statement.start, chunk);
    if (statement.end)
        statement.end = iterate(statement.end, chunk);


    
    //if the statement is a binary expression, calculate it
    if (statement.type == "BinaryExpression") {
        statement = calc(statement, chunk);
    }



    return statement;
}

export default ((chunk: luaparse.Chunk) => {
    //this deobfucasion function evulates all math expressions and on if checks replaces them with the result (true or false)
    //example:
    //local a = 1 + 2
    //while a < 5 do a = a + 1 end
    //becomes
    //local a = 3
    //while false do a = a + 1 end

    //Run it twice, as "12-12 == 12-12" turns into "0 == 0" which can then turn into "true"
    chunk = iterate(chunk, chunk);
    chunk = iterate(chunk, chunk);
    return chunk;
});