type TaggedLexeme<T extends string, V extends string> = { tag: T, value: V };

export type Lexeme = TaggedLexeme<string, string>;
export type Keyword<V extends string> = TaggedLexeme<"keyword", V>;
export type Operator<V extends string> = TaggedLexeme<"operator", V>;
export type Identifier<V extends string> = TaggedLexeme<"identifier", V>;
export type Eof = TaggedLexeme<"special", "<end of file>">;

type Alphabet =
    | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m"
    | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
    | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M"
    | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

type Digits = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Keywords = 'if' | 'then' | 'else' | 'true' | 'false' | 'let';

// Some identifiers are in fact keywords, e.g. `if`, `true`, but not others e.g. `true0` or `if5`.
type TokenizeIdentifier<I extends string, Rest extends string> =
    | Rest extends `${infer L extends Alphabet | Digits | '_'}${infer Rest}` ? TokenizeIdentifier<`${I}${L}`, Rest>
    : I extends Keywords ? [Keyword<I>, Rest]
    : [Identifier<I>, Rest];

type TokenizeOne<S extends string> =
    | S extends `==${infer Rest}` ? [Operator<"==">, Rest]
    : S extends `=${infer Rest}` ? [Operator<"=">, Rest]
    : S extends `.${infer Rest}` ? [Operator<".">, Rest]
    : S extends `(${infer Rest}` ? [Operator<"(">, Rest]
    : S extends `)${infer Rest}` ? [Operator<")">, Rest]
    : S extends `{${infer Rest}` ? [Operator<"{">, Rest]
    : S extends `}${infer Rest}` ? [Operator<"}">, Rest]
    : S extends `${infer L extends Alphabet | '_'}${infer Rest}` ? TokenizeIdentifier<L, Rest>
    : S extends ` ${infer Rest}` ? TokenizeOne<Rest>
    : [Eof, ""];

export type Tokenize<S extends string, Acc extends Lexeme[] = []> =
    | TokenizeOne<S> extends infer T extends [Lexeme, string]
        ? S extends "" ? Acc : Tokenize<T[1], [...Acc, T[0]]>
        : never;
