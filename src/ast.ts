type TaggedAst<T extends string, U extends string, N> = { tag: `${T}-${U}`, node: N };
type TaggedAstExpr<T extends string, N> = TaggedAst<T, "expr", N>;
type TaggedAstStat<T extends string, N> = TaggedAst<T, "stat", N>;

export type AstNode = TaggedAst<string, string, unknown>;

export type AstBooleanExpr<B extends boolean> = TaggedAstExpr<"boolean", { value: B }>;
export type AstNumberExpr<N extends number> = TaggedAstExpr<"number", { value: N }>;
export type AstGroupExpr<N extends AstNode> = TaggedAstExpr<"group", { node: N }>
export type AstIfExpr<C extends AstNode, T extends AstNode, F extends AstNode> = TaggedAstExpr<"if", { c: C, t: T, f: F }>

export type AstExpr =
    | AstBooleanExpr<boolean>
    | AstNumberExpr<number>
    | AstGroupExpr<AstNode>
    | AstIfExpr<AstNode, AstNode, AstNode>;

export type AstLetStat<N extends string, E extends AstExpr> = TaggedAstStat<"let", { name: N, expr: E }>;

export type AstStat =
    | AstLetStat<string, AstExpr>;
