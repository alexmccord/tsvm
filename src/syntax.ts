import { Lexeme, Keyword, Identifier, Operator, Num, Str } from "./lexer";

export type StringExpressionSyntax<S extends string, Rest extends Lexeme[]> =
    | [Str<S>, ...Rest];
export type BooleanExpressionSyntax<B extends boolean, Rest extends Lexeme[]> =
    | [Keyword<`${B}`>, ...Rest];
export type NumberExpressionSyntax<N extends number, Rest extends Lexeme[]> =
    | [Num<N>, ...Rest];
export type IndentifierSyntax<N extends string, Rest extends Lexeme[]> =
    | [Identifier<N>, ...Rest];

export type BeginGroupExpressionSyntax<Rest extends Lexeme[]> =
    | [Operator<"(">, ...Rest];
export type EndGroupExpressionSyntax<Rest extends Lexeme[]> =
    | [Operator<")">, ...Rest];

export type IfExpressionCond<Rest extends Lexeme[]> =
    | [Keyword<"if">, ...Rest];
export type IfExpressionThen<Rest extends Lexeme[]> =
    | [Keyword<"then">, ...Rest];
export type IfExpressionElse<Rest extends Lexeme[]> =
    | [Keyword<"else">, ...Rest];

export type BeginBlockSyntax<Rest extends Lexeme[]> =
    | [Operator<"{">, ...Rest];
export type EndBlockSyntax<Rest extends Lexeme[]> =
    | [Operator<"}">, ...Rest];

export type LetStatementSyntax<Rest extends Lexeme[]> =
    | [Keyword<"let">, ...Rest];
export type NameOfLetStatementSyntax<N extends string, Rest extends Lexeme[]> =
    | [Identifier<N>, ...Rest];
export type InitializerLetStatementSyntax<Rest extends Lexeme[]> =
    | [Operator<"=">, ...Rest];

export type ReturnStatementSyntax<Rest extends Lexeme[]> =
    | [Keyword<"return">, ...Rest];
