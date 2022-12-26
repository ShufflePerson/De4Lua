import luaparse from 'luaparse'
import { ast_builder } from '../../ast/builder/ast_builder';
import { t_types } from '../../ast/builder/types/t_types';
import { t_Loc } from '../types/t_loc';
import get_variable_declaration from './get_variable_declaration';



export default ((chunk: luaparse.Chunk, var_declaration: t_types.LOCAL_STATEMENT, stop_at_line: t_Loc, location_statment: luaparse.BinaryExpression): t_types.LOCAL_STATEMENT | t_types.ASSIGNMENT_STATEMENT => {
    

    return var_declaration;
})