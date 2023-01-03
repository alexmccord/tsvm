import type { NilValue, Value } from "./value";

export type Register<R extends string, V extends Value> = { [P in R]: V };
export type Registers = { [reg: string]: Value };
export type GetRegisters<VM extends VirtualMachine> = VM["regs"];

export type Stack = Value[];
export type GetStack<VM extends VirtualMachine> = VM["stack"];
export type Top<VM extends VirtualMachine, I extends number = 0> = GetStack<VM>[I] extends infer V extends Value ? V : NilValue;

export type PC<L extends string, F extends number> = { label: L, frame: F };
export type MainPC = PC<"main", 0>;
export type GetPC<VM extends VirtualMachine> = VM["pc"];
export type GetLabel<VM extends VirtualMachine> = GetPC<VM>["label"];
export type GetFrame<VM extends VirtualMachine> = GetPC<VM>["frame"];

export type Returns = PC<string, number>[];
export type GetReturns<VM extends VirtualMachine> = VM["returns"];

export type FreshVM = VMState<{}, []>;
export type VMState<R extends Registers, S extends Stack, J extends PC<string, number> = MainPC, Rets extends Returns = []> = { regs: R, stack: S, pc: J, returns: Rets, };
export type VirtualMachine = VMState<Registers, Stack, PC<string, number>, Returns>;
