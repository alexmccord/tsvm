type TaggedValue<Tag extends string, D> = { tag: Tag, value: D };

export type NumberValue<V extends number> = TaggedValue<"number", V>;
export type BooleanValue<V extends boolean> = TaggedValue<"boolean", V>;
export type StringValue<V extends string> = TaggedValue<"string", V>;
export type NilValue = TaggedValue<"nil", null>;

export type Value =
    | NumberValue<number>
    | BooleanValue<boolean>
    | StringValue<string>
    | NilValue;
