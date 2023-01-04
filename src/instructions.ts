export type PushInstruction<L extends number | boolean | string> = ["push", L];
export type PopInstruction = ["pop"];
export type StoreInstruction<R extends string> = ["store", R];
export type LoadInstruction<R extends string> = ["load", R];
export type ConcatInstruction = ["concat"];
export type EqInstruction = "eq";
export type JmpInstruction<L extends number> = ["jmp", L];
export type RetInstruction = ["ret"];
export type CallInstruction<L extends number> = ["call", L];
export type JeInstruction<L extends number> = ["je", L];
export type JneInstruction<L extends number> = ["jne", L];
export type Instruction =
    | PushInstruction<number | boolean | string>
    | PopInstruction
    | StoreInstruction<string>
    | LoadInstruction<string>
    | ConcatInstruction
    | EqInstruction
    | JmpInstruction<number>
    | RetInstruction
    | CallInstruction<number>
    | JeInstruction<number>
    | JneInstruction<number>;
