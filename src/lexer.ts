type TaggedLexeme<T extends string, V> = { tag: T, value: V };

export type Lexeme = TaggedLexeme<string, string | number>;
export type Keyword<K extends string> = TaggedLexeme<"keyword", K>;
export type Operator<O extends string> = TaggedLexeme<"operator", O>;
export type Str<S extends string> = TaggedLexeme<"string", S>;
export type Num<N extends number> = TaggedLexeme<"number", N>;
export type Identifier<I extends string> = TaggedLexeme<"identifier", I>;
export type Eof = TaggedLexeme<"special", "<end of file>">;

type Alphabet =
    | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m"
    | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
    | "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M"
    | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z";

type Digits = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Operators = "=" | "." | "(" | ")" | "{" | "}";
type Keywords = "if" | "then" | "else" | "true" | "false" | "let" | "return";

// Some identifiers are in fact keywords, e.g. `if`, `true`, but not others e.g. `true0` or `if5`.
type TokenizeIdentifier<Acc extends string, Rest extends string> =
    | Rest extends `${infer L extends Alphabet | Digits | '_'}${infer Rest}` ? TokenizeIdentifier<`${Acc}${L}`, Rest>
    : Acc extends Keywords ? [Keyword<Acc>, Rest]
    : [Identifier<Acc>, Rest];

// No rich number literals yet, e.g. 1_000_000, 1.2, etc.
// Not perfect yet either, e.g. Tokenize<"5_5"> ~ [Num<5>, Identifier<"_5">] :(
type TokenizeNumber<Acc extends string, Rest extends string> =
    | Rest extends `${infer D extends Digits}${infer Rest}` ? TokenizeNumber<`${Acc}${D}`, Rest>
    : Acc extends `${infer N extends number}` ? [Num<N>, Rest]
    : never;

type TokenizeString<Acc extends string, Rest extends string> =
    | Rest extends `\\'${infer Rest}` ? TokenizeString<`${Acc}'`, Rest>
    : Rest extends `'${infer Rest}` ? [Str<Acc>, Rest]
    : Rest extends `\n${infer _}` ? never // string not properly closed
    : Rest extends `${infer L}${infer Rest}` ? TokenizeString<`${Acc}${L}`, Rest>
    : never;

type TokenizeOne<S extends string> =
    | S extends `==${infer Rest}` ? [Operator<"==">, Rest]
    : S extends `${infer O extends Operators}${infer Rest}` ? [Operator<O>, Rest]
    : S extends `${infer L extends Alphabet | '_'}${infer Rest}` ? TokenizeIdentifier<L, Rest>
    : S extends `${infer D extends Digits}${infer Rest}` ? TokenizeNumber<D, Rest>
    : S extends `'${infer Rest}` ? TokenizeString<"", Rest>
    : S extends ` ${infer Rest}` ? TokenizeOne<Rest>
    : [Eof, ""];

export type Tokenize<S extends string, Acc extends Lexeme[] = []> =
    | TokenizeOne<S> extends infer T extends [Lexeme, string]
        ? S extends "" ? Acc : Tokenize<T[1], [...Acc, T[0]]>
        : never;
