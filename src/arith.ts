type ToArray<N extends number, A extends [][] = []> = A["length"] extends N ? A : ToArray<N, [[], ...A]>;

// TODO: We probably need ts-arithmetic, presumably that's more efficient and more correct.
export type Add<L extends number, R extends number> = [...ToArray<L>, ...ToArray<R>]["length"] extends infer N extends number ? N : never;
