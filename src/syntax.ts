import { Lexeme, Keyword, Identifier, Operator } from "./lexer";

export type BooleanExpressionSyntax<B extends boolean, Rest extends Lexeme[]> =
    | [Keyword<`${B}`>, ...Rest];
export type BeginGroupExpressionSyntax<Rest extends Lexeme[]> =
    | [Operator<"(">, ...Rest];
export type EndGroupExpressionSyntax<Rest extends Lexeme[]> =
    | [Operator<")">, ...Rest];

export type LetStatementSyntax<N extends string, Rest extends Lexeme[]> =
    | [Keyword<"let">, Identifier<N>, Operator<"=">, ...Rest];
