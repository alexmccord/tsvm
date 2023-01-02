import { AstBooleanExpr, AstExpr, AstLetStat, AstStat } from "./ast";
import { Lexeme, Tokenize } from "./lexer"
import { ExtractBooleanExpression, ExtractLetStatement } from "./syntax";

type ParseExpression<Lexemes extends Lexeme[]> =
    | Lexemes extends ExtractBooleanExpression<infer B, infer Rest> ? [AstBooleanExpr<B>, Rest]
    : never;

type ParseLetStatement<N extends string, Lexemes extends Lexeme[]> =
    | ParseExpression<Lexemes> extends [infer E extends AstExpr, infer Rest extends Lexeme[]]
        ? [AstLetStat<N, E>, Rest]
        : never;

type ParseStatement<Lexemes extends Lexeme[]> =
    | Lexemes extends ExtractLetStatement<infer N, infer Rest> ? ParseLetStatement<N, Rest>
    : never;

type ParseBlock<Lexemes extends Lexeme[], ParsedStats extends AstStat[] = []> =
    | Lexemes extends [] ? ParsedStats
    : ParseStatement<Lexemes> extends [infer S extends AstStat, infer Rest extends Lexeme[]] ? ParseBlock<Rest, [...ParsedStats, S]>
    : never;

export type Parse<S extends string> = ParseBlock<Tokenize<S>>;
