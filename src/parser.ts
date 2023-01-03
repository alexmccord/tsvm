import { AstBinaryEqExpr, AstBlock, AstBooleanExpr, AstExpr, AstExprStat, AstFnCall, AstFnStat, AstGroupExpr, AstIdentifierExpr, AstIfExpr, AstLetStat, AstNode, AstNopStatement, AstNumberExpr, AstReturnStat, AstStat, AstStringExpr } from "./ast";
import { Eof, Identifier, Lexeme, Operator, Tokenize } from "./lexer"
import { BooleanExpressionSyntax, BeginGroupExpressionSyntax, EndGroupExpressionSyntax, IfExpressionCond, IfExpressionThen, IfExpressionElse, BeginBlockSyntax, EndBlockSyntax, LetStatementSyntax, InitializerLetStatementSyntax, ReturnStatementSyntax, IdentifierSyntax as IdentifierSyntax, NumberExpressionSyntax, StringExpressionSyntax, BinaryEqualSyntax, BeginFnStatementSyntax } from "./syntax";

type Ok<N extends AstNode | AstNode[], Lexemes extends Lexeme[]> = { tag: "ok", node: N, lexemes: Lexemes };
type Err<E extends string> = { tag: "err", err: E };
type Ice<E extends string> = { tag: "ice", err: E }; // Internal compiler error.
type Inexhaustive<N extends string> = Ice<`${N} match was inexhaustive!`>;
type Result<N extends AstNode | AstNode[], Lexemes extends Lexeme[], E extends string> =
    | Ok<N, Lexemes>
    | Err<E>
    | Ice<E>;
type ResultConstraint = Result<AstNode | AstNode[], Lexeme[], string>;

type ParseGroupExpression<Lexemes extends Lexeme[]> =
    | ParseExpression<Lexemes> extends infer R extends ResultConstraint
        ? R extends Ok<infer E extends AstExpr, EndGroupExpressionSyntax<infer Rest>> ? Ok<AstGroupExpr<E>, Rest>
        : R extends Ok<AstExpr, Lexeme[]> ? Err<"expected `)` to close `(`">
        : R
    : Inexhaustive<"ParseGroupExpression">;

// TODO: rewrite this one to be cleaner when possible
type ParseIfExpression<Lexemes extends Lexeme[]> =
    | ParseExpression<Lexemes> extends infer R1 extends ResultConstraint
        ? R1 extends Ok<infer C extends AstExpr, IfExpressionThen<infer Rest>>
            ? ParseExpression<Rest> extends infer R2 extends ResultConstraint
                ? R2 extends Ok<infer T extends AstExpr, IfExpressionElse<infer Rest>>
                    ? ParseExpression<Rest> extends infer R3 extends ResultConstraint
                        ? R3 extends Ok<infer F extends AstExpr, infer Rest> ? Ok<AstIfExpr<C, T, F>, Rest>
                        : R3
                    : Inexhaustive<"ParseIfExpression: else <expr>">
                : R2 extends Ok<AstExpr, Lexeme[]> ? Err<"expected `else`">
                : R2
            : Inexhaustive<"ParseIfExpression: then <expr>">
        : R1 extends Ok<AstExpr, Lexeme[]> ? Err<"expected `then`">
        : R1
    : Inexhaustive<"ParseIfExpression: if <expr>">;

type ParseBlockExpression<Lexemes extends Lexeme[]> =
    | Lexemes extends EndBlockSyntax<infer Rest> ? Ok<AstBlock<[]>, Rest>
    : ParseStatements<Lexemes> extends infer R extends ResultConstraint
        ? R extends Ok<infer S extends AstStat[], EndBlockSyntax<infer Rest>> ? Ok<AstBlock<S>, Rest>
        : R
    : Inexhaustive<"ParseBlockExpression">;

type ParsePrimaryExpression<Lexemes extends Lexeme[]> =
    | ParseSimpleExpression<Lexemes> extends infer R extends ResultConstraint
        ? R extends Ok<infer E extends AstExpr, infer Rest>
            ? Rest extends [Operator<"(">, Operator<")">, ...infer Rest extends Lexeme[]] ? Ok<AstFnCall<E>, Rest>
            : Ok<E, Rest>
        : R
    : Inexhaustive<"ParsePrimaryExpression">;

type ParseSimpleExpression<Lexemes extends Lexeme[]> =
    | Lexemes extends StringExpressionSyntax<infer S, infer Rest> ? Ok<AstStringExpr<S>, Rest>
    : Lexemes extends BooleanExpressionSyntax<infer B, infer Rest> ? Ok<AstBooleanExpr<B>, Rest>
    : Lexemes extends NumberExpressionSyntax<infer N, infer Rest> ? Ok<AstNumberExpr<N>, Rest>
    : Lexemes extends IdentifierSyntax<infer N, infer Rest> ? Ok<AstIdentifierExpr<N>, Rest>
    : Lexemes extends BeginGroupExpressionSyntax<infer Rest> ? ParseGroupExpression<Rest>
    : Lexemes extends IfExpressionCond<infer Rest> ? ParseIfExpression<Rest>
    : Lexemes extends BeginBlockSyntax<infer Rest> ? ParseBlockExpression<Rest>
    : Lexemes extends [Eof] ? Err<"expected an expression, got end of file">
    : Err<`expected an expression, got '${Lexemes[0]["value"]}'`>;

type ParseComparisonExpression<Lexemes extends Lexeme[]> =
    | ParsePrimaryExpression<Lexemes> extends infer R1 extends ResultConstraint
        ? R1 extends Ok<infer L extends AstExpr, BinaryEqualSyntax<infer Rest>>
            ? ParsePrimaryExpression<Rest> extends infer R2 extends ResultConstraint
                ? R2 extends Ok<infer R extends AstExpr, infer Rest> ? Ok<AstBinaryEqExpr<L, R>, Rest>
                : R2
            : Inexhaustive<"ParseBinaryExpression: == <expr>">
        : R1
    : Inexhaustive<"ParseBinaryExpression: <expr> <bin-op>">;

type ParseExpression<Lexemes extends Lexeme[]> = ParseComparisonExpression<Lexemes>;

type ParseLetStatement<Lexemes extends Lexeme[]> =
    | Lexemes extends IdentifierSyntax<infer N, infer Rest>
        ? Rest extends InitializerLetStatementSyntax<infer Rest>
            ? ParseExpression<Rest> extends infer R extends ResultConstraint
                ? R extends Ok<infer E extends AstExpr, infer Rest> ? Ok<AstLetStat<N, E>, Rest>
                : R
            : Inexhaustive<"ParseExpression">
        : Err<"expected `=` to come after the name">
    : Err<"expected a name to come after the 'let' keyword">;

type ParseBlockStatement<Lexemes extends Lexeme[]> =
    | ParseBlockExpression<Lexemes> extends infer R extends ResultConstraint
        ? R extends Ok<infer E extends AstExpr, infer Rest> ? Ok<AstExprStat<E>, Rest>
        : R
    : Inexhaustive<"ParseBlockStatement">;

type ParseReturnStatement<Lexemes extends Lexeme[]> =
    | ParseExpression<Lexemes> extends infer R extends ResultConstraint
        ? R extends Ok<infer E extends AstExpr, infer Rest> ? Ok<AstReturnStat<E>, Rest>
        : R
    : Inexhaustive<"ParseReturnStatement">;

type ParseFnStatement<N extends string, Lexemes extends Lexeme[]> =
    | Lexemes extends BeginBlockSyntax<infer Rest>
        ? ParseBlockStatement<Rest> extends infer R extends ResultConstraint
            ? R extends Ok<AstExprStat<infer B extends AstBlock<AstStat[]>>, infer Rest> ? Ok<AstFnStat<N, B>, Rest>
            : R
        : Inexhaustive<"ParseFnStatement">
    : Err<`fn '${N}' is missing an implementation`>;

type TryParseStatement<Lexemes extends Lexeme[]> =
    | Lexemes extends LetStatementSyntax<infer Rest> ? ParseLetStatement<Rest>
    : Lexemes extends BeginBlockSyntax<infer Rest> ? ParseBlockStatement<Rest>
    : Lexemes extends ReturnStatementSyntax<infer Rest> ? ParseReturnStatement<Rest>
    : Lexemes extends BeginFnStatementSyntax<infer N, infer Rest> ? ParseFnStatement<N, Rest>
    : Ok<AstNopStatement, Lexemes>;

type ParseStatement<Lexemes extends Lexeme[]> =
    | TryParseStatement<Lexemes> extends infer R extends ResultConstraint
        ? R extends Ok<AstNopStatement, Lexeme[]> ? Err<`unknown token '${Lexemes[0]["value"]}' when parsing a statement`>
        : R
    : Inexhaustive<"ParseStatement">;

type ParseStatements<Lexemes extends Lexeme[], Acc extends AstStat[] = []> =
    | Lexemes extends [Eof] ? Ok<Acc, Lexemes>
    : TryParseStatement<Lexemes> extends infer R extends ResultConstraint
        ? R extends Ok<AstNopStatement, infer Rest> ? Ok<Acc, Rest>
        : R extends Ok<infer S extends AstStat, infer Rest> ? ParseStatements<Rest, [...Acc, S]>
        : R
    : Inexhaustive<"ParseStatements">;

export type Parse<S extends string> =
    | ParseStatements<Tokenize<S>> extends infer R extends ResultConstraint
        ? R extends Ok<infer N, [] | [Eof]> ? N
        : R extends Ok<infer _, [infer L extends Lexeme, ...Lexeme[]]> ? `unknown token '${L["value"]}' when parsing a statement`
        : R extends Err<infer E> ? E
        : R extends Ice<infer E> ? `Internal error: ${E}`
        : "Internal error: Parse match is inexhaustive"
    : "Internal error: ParseStatements should return a subtype of ResultConstraint";
