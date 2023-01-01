import { Add } from "./arith";
import { Bytecode } from "./bytecode";
import { CallInstruction, ConcatInstruction, EqInstruction, Instruction, JeInstruction, JmpInstruction, JneInstruction, LoadInstruction, PopInstruction, PushInstruction, RetInstruction, StoreInstruction } from "./instructions";
import { Value, NilValue, StringValue, BooleanValue, NumberValue } from "./value";
import { VirtualMachine, VMState, GetRegisters, GetStack, GetPC, GetReturns, Stack, Register, Top, PC, Returns, GetLabel, GetFrame } from "./vm";

export type Push<VM extends VirtualMachine, V extends Value> = VMState<GetRegisters<VM>, [V, ...GetStack<VM>], GetPC<VM>, GetReturns<VM>>;

export type Pop<VM extends VirtualMachine> = GetStack<VM> extends [infer _, ...infer Rest extends Stack]
    ? VMState<GetRegisters<VM>, Rest, GetPC<VM>, GetReturns<VM>>
    : never;

export type Store<VM extends VirtualMachine, R extends string> = Pop<VM> extends infer VM2 extends VirtualMachine
    ? VMState<Omit<GetRegisters<VM2>, R> & Register<R, Top<VM>>, GetStack<VM2>, GetPC<VM>, GetReturns<VM>>
    : never;

export type Load<VM extends VirtualMachine, R extends string> =
    | GetRegisters<VM> extends { [P in R]: infer V extends Value } ? Push<VM, V> : Push<VM, NilValue>;

export type Concat<VM extends VirtualMachine> = [Top<VM>, Top<VM, 1>] extends [StringValue<infer R>, StringValue<infer L>]
    ? Push<Pop<Pop<VM>>, StringValue<`${L}${R}`>>
    : never;

export type Eq<VM extends VirtualMachine> = [Top<VM>, Top<VM, 1>] extends [infer R, infer L]
    ? Push<Pop<Pop<VM>>, BooleanValue<R & L extends never ? false : true>>
    : never;

export type Jmp<VM extends VirtualMachine, L extends string> = VMState<GetRegisters<VM>, GetStack<VM>, PC<L, 0>, GetReturns<VM>>;

export type Ret<VM extends VirtualMachine> = GetReturns<VM> extends [infer R extends PC<string, number>, ...infer Rest extends Returns]
    ? VMState<GetRegisters<VM>, GetStack<VM>, R, Rest>
    : VM;

export type Call<VM extends VirtualMachine, L extends string, F extends number> =
    | VMState<GetRegisters<VM>, GetStack<VM>, GetPC<VM>, [PC<L, F>, ...GetReturns<VM>]>;

export type Je<VM extends VirtualMachine, L extends string> = Top<Eq<VM>> & BooleanValue<true> extends never
    ? Pop<Eq<VM>>
    : Jmp<Pop<Eq<VM>>, L>;

export type Jne<VM extends VirtualMachine, L extends string> = Top<Eq<VM>> & BooleanValue<false> extends never
    ? Pop<Eq<VM>>
    : Jmp<Pop<Eq<VM>>, L>;

export type Dispatch<VM extends VirtualMachine, B extends Bytecode> =
    | B[GetLabel<VM>][GetFrame<VM>] extends infer I extends Instruction
        ? I extends PushInstruction<infer N extends number> ? Push<VM, NumberValue<N>>
        : I extends PushInstruction<infer B extends boolean> ? Push<VM, BooleanValue<B>>
        : I extends PushInstruction<`'${infer S extends string}'`> ? Push<VM, StringValue<S>>
        : I extends PopInstruction ? Pop<VM>
        : I extends StoreInstruction<infer R> ? Store<VM, R>
        : I extends LoadInstruction<infer R> ? Load<VM, R>
        : I extends ConcatInstruction ? Concat<VM>
        : I extends EqInstruction ? Eq<VM>
        : I extends JmpInstruction<infer L> ? Jmp<VM, L>
        : I extends RetInstruction ? Ret<VM>
        : I extends CallInstruction<infer L> ? Call<Jmp<VM, L>, GetLabel<VM>, Add<GetFrame<VM>, 1>>
        : I extends JeInstruction<infer L> ? Je<VM, L>
        : I extends JneInstruction<infer L> ? Jne<VM, L>
        : never
    : never;
