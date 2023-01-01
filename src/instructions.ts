export type PushInstruction<L extends number | boolean | `'${string}'`> = `push ${L}`;
export type PopInstruction = `pop`;
export type StoreInstruction<R extends string> = `store ${R}`;
export type LoadInstruction<R extends string> = `load ${R}`;
export type ConcatInstruction = `concat`;
export type EqInstruction = `eq`;
export type JmpInstruction<L extends string> = `jmp ${L}`;
export type RetInstruction = `ret`;
export type CallInstruction<L extends string> = `call ${L}`;
export type JeInstruction<L extends string> = `je ${L}`;
export type JneInstruction<L extends string> = `jne ${L}`;
export type Instruction =
    | PushInstruction<number | boolean | `'${string}'`>
    | PopInstruction
    | StoreInstruction<string>
    | LoadInstruction<string>
    | ConcatInstruction
    | EqInstruction
    | JmpInstruction<string>
    | RetInstruction
    | CallInstruction<string>
    | JeInstruction<string>
    | JneInstruction<string>;
