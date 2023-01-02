import { Lexeme, Keyword, Identifier, Operator } from "./lexer";

export type ExtractBooleanExpression<B extends boolean, Rest extends Lexeme[]> =
    | [Keyword<`${B}`>, ...Rest];

export type ExtractLetStatement<N extends string, Rest extends Lexeme[]> =
    | [Keyword<"let">, Identifier<N>, Operator<"=">, ...Rest];
