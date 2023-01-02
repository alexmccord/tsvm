import { AstBooleanExpr, AstExpr, AstGroupExpr, AstIfExpr, AstLetStat, AstStat } from "./ast";
import { Lexeme, Tokenize } from "./lexer"
import { BooleanExpressionSyntax, BeginGroupExpressionSyntax, LetStatementSyntax, EndGroupExpressionSyntax, IfExpressionCond, IfExpressionThen, IfExpressionElse } from "./syntax";

type ParseGroupExpression<Lexemes extends Lexeme[]> =
    | ParseExpression<Lexemes> extends [infer E extends AstExpr, EndGroupExpressionSyntax<infer Rest>]
        ? [AstGroupExpr<E>, Rest]
        : never;

type ParseIfExpression<CondRest extends Lexeme[]> =
    | ParseExpression<CondRest> extends [infer C extends AstExpr, IfExpressionThen<infer ThenRest>]
        ? ParseExpression<ThenRest> extends [infer T extends AstExpr, IfExpressionElse<infer ElseRest>]
            ? ParseExpression<ElseRest> extends [infer E extends AstExpr, infer Rest]
                ? [AstIfExpr<C, T, E>, Rest]
                : never
            : never
        : never;

type ParseExpression<Lexemes extends Lexeme[]> =
    | Lexemes extends BooleanExpressionSyntax<infer B, infer Rest> ? [AstBooleanExpr<B>, Rest]
    : Lexemes extends BeginGroupExpressionSyntax<infer Rest> ? ParseGroupExpression<Rest>
    : Lexemes extends IfExpressionCond<infer Rest> ? ParseIfExpression<Rest>
    : never;

type ParseLetStatement<N extends string, Lexemes extends Lexeme[]> =
    | ParseExpression<Lexemes> extends [infer E extends AstExpr, infer Rest extends Lexeme[]]
        ? [AstLetStat<N, E>, Rest]
        : never;

type ParseStatement<Lexemes extends Lexeme[]> =
    | Lexemes extends LetStatementSyntax<infer N, infer Rest> ? ParseLetStatement<N, Rest>
    : never;

type ParseBlock<Lexemes extends Lexeme[], ParsedStats extends AstStat[] = []> =
    | Lexemes extends [] ? ParsedStats
    : ParseStatement<Lexemes> extends [infer S extends AstStat, infer Rest extends Lexeme[]] ? ParseBlock<Rest, [...ParsedStats, S]>
    : never;

export type Parse<S extends string> = ParseBlock<Tokenize<S>>;
