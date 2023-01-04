type TaggedValue<T extends string, D> = { tag: T, value: D };

export type Address<N extends number> = TaggedValue<"address", N>;
export type NumberValue<N extends number> = TaggedValue<"number", N>;
export type BooleanValue<B extends boolean> = TaggedValue<"boolean", B>;
export type StringValue<S extends string> = TaggedValue<"string", S>;
export type NilValue = TaggedValue<"nil", null>;
export type Value =
    | Address<number>
    | NumberValue<number>
    | BooleanValue<boolean>
    | StringValue<string>
    | NilValue;
