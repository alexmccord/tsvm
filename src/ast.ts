type TaggedAst<T extends string, N extends string, Node> = { tag: T, name: N, node: Node };
type TaggedAstExpr<T extends string, N> = TaggedAst<"expr", T, N>;
type TaggedAstStat<T extends string, N> = TaggedAst<"stat", T, N>;

// We do this instead of a union of expression/statement types to break the circular reference.
export type AstNode = AstExpr | AstStat;
export type AstExpr = { tag: "expr" };
export type AstStat = { tag: "stat" };

export type AstBooleanExpr<B extends boolean> = TaggedAstExpr<"boolean", { value: B }>;
export type AstNumberExpr<N extends number> = TaggedAstExpr<"number", { value: N }>;
export type AstGroupExpr<N extends AstExpr> = TaggedAstExpr<"group", { node: N }>
export type AstIfExpr<C extends AstExpr, T extends AstExpr, F extends AstExpr> = TaggedAstExpr<"if", { c: C, t: T, f: F }>
export type AstBlock<S extends AstStat[]> = TaggedAstExpr<"block", { stats: S }>

export type AstNopStatement = TaggedAstStat<"nop", null>;
export type AstLetStat<N extends string, E extends AstExpr> = TaggedAstStat<"let", { name: N, expr: E }>;
export type AstExprStat<E extends AstExpr> = TaggedAstStat<"expression statement", { expr: E }>;
export type AstReturnStat<E extends AstExpr> = TaggedAstStat<"return", { ret: E }>;
