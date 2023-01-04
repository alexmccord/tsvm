import type { NilValue, Value } from "./value";

export type Register<R extends string, V extends Value> = { [P in R]: V };
export type Registers = { [reg: string]: Value };

export type Stack = Value[];
export type Top<VM extends VirtualMachine, I extends number = 0> = GetStack<VM>[I] extends infer V extends Value ? V : NilValue;

export type InstructionPtr<N extends number> = { tag: "ip", n: N };
export type MainInstructionPtr = InstructionPtr<0>;
export type GetInstructionPtrAddress<VM extends VirtualMachine> = GetInstructionPtr<VM>["n"];

export type FreshVM = VMState<{}, []>;
export type VirtualMachine = VMState<Registers, Stack, InstructionPtr<number>>;
export type VMState<R extends Registers, S extends Stack, IP extends InstructionPtr<number> = MainInstructionPtr> =
    | { regs: R, stack: S, ip: IP };

export type GetRegisters<VM extends VirtualMachine> = VM["regs"];
export type UpdateRegister<VM extends VirtualMachine, R extends string, V extends Value> =
    | VMState<Omit<GetRegisters<VM>, R> & { [P in R]: V }, GetStack<VM>, GetInstructionPtr<VM>>;
export type GetValueFromRegister<VM extends VirtualMachine, R extends string> =
    | VM extends VMState<{ [P in R]: infer V extends Value }, infer _1, infer _2> ? V : NilValue;

export type GetStack<VM extends VirtualMachine> = VM["stack"];
export type UpdateStack<VM extends VirtualMachine, S extends Stack> =
    | VMState<GetRegisters<VM>, S, GetInstructionPtr<VM>>;

export type GetInstructionPtr<VM extends VirtualMachine> = VM["ip"];
export type UpdateInstructionPtr<VM extends VirtualMachine, I extends InstructionPtr<number>> =
    | VMState<GetRegisters<VM>, GetStack<VM>, I>;
