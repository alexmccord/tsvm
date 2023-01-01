import { Add } from "./arith";
import { Dispatch } from "./dispatch";
import { Instruction } from "./instructions";
import type { GetFrame, GetLabel, GetPC, GetRegisters, GetReturns, GetStack, PC, Registers, VirtualMachine, VMState } from "./vm";

type Advance<VM extends VirtualMachine> = VMState<GetRegisters<VM>, GetStack<VM>, PC<GetLabel<VM>, Add<GetFrame<VM>, 1>>, GetReturns<VM>>;

export type Program = Instruction[];
export type Bytecode = { [label: string]: Program };

type ShowRegisters<T extends Registers> = T extends T ? { [P in keyof T]: T[P] } : never;
type ShowVM<VM extends VirtualMachine> = VM extends VM ? VMState<ShowRegisters<GetRegisters<VM>>, GetStack<VM>, GetPC<VM>, GetReturns<VM>> : never;

export type Interpret<VM extends VirtualMachine, B extends Bytecode> = InterpretImpl<VM, B> extends infer Interpreted extends VirtualMachine
    ? ShowVM<Interpreted>
    : never;

type InterpretImpl<VM extends VirtualMachine, B extends Bytecode> =
    | B[GetLabel<VM>][GetFrame<VM>] extends infer I extends Instruction | undefined
        ? I extends Instruction ? Dispatch<VM, B> extends infer Stepped extends VirtualMachine
            ? GetPC<Stepped> & GetPC<VM> extends never ? Interpret<Stepped, B> : Interpret<Advance<Stepped>, B>
            : never
        : I extends undefined ? VM : never
        : never;
