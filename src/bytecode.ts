import { Add } from "./arith";
import { Dispatch } from "./dispatch";
import { Instruction } from "./instructions";
import type { GetInstructionPtrAddress, InstructionPtr, UpdateInstructionPtr, VirtualMachine } from "./vm";

type Advance<VM extends VirtualMachine> = UpdateInstructionPtr<VM, InstructionPtr<Add<GetInstructionPtrAddress<VM>, 1>>>;

export type Bytecode = Instruction[];

export type Interpret<VM extends VirtualMachine, B extends Bytecode> =
    | VM extends never ? VM
    : B[GetInstructionPtrAddress<VM>] extends infer I extends Instruction ? Interpret<Dispatch<Advance<VM>, I>, B>
    : Advance<VM>;
