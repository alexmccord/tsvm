import { AstBooleanExpr, AstExpr, AstGroupExpr, AstLetStat, AstStat } from "./ast";
import { Identifier, Keyword, Lexeme, Operator, Tokenize } from "./lexer"

type ParseExpression<Lexemes extends Lexeme[]> =
    | Lexemes extends [Keyword<`${infer B extends boolean}`>, ...infer Rest extends Lexeme[]] ? [AstBooleanExpr<B>, Rest]
    : never;

type ExtractLetStatement<N extends string, Rest extends Lexeme[]> =
    | [Keyword<"let">, Identifier<N>, Operator<"=">, ...Rest];

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
