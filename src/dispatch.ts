import { CallInstruction, ConcatInstruction, EqInstruction, Instruction, JeInstruction, JmpInstruction, JneInstruction, LoadInstruction, PopInstruction, PushInstruction, RetInstruction, StoreInstruction } from "./instructions";
import { Value, StringValue, BooleanValue, NumberValue, Address } from "./value";
import { VirtualMachine, VMState, Stack, Top, InstructionPtr, GetInstructionPtrAddress, UpdateRegister, GetValueFromRegister, UpdateInstructionPtr, UpdateStack, GetStack } from "./vm";

/// Push the value V into the stack.
///
/// Does not panic.
export type Push<VM extends VirtualMachine, V extends Value> =
    | UpdateStack<VM, [V, ...GetStack<VM>]>;

/// Pops a value from the top of the stack.
///
/// Panics if there are no values in the stack.
export type Pop<VM extends VirtualMachine> =
    | VM extends VMState<infer R, [infer _ extends Value, ...infer S extends Stack], infer IP> ? VMState<R, S, IP>
    : never;

/// Pops a value from the top of the stack, and then store it at the register R.
///
/// Does not panic.
export type Store<VM extends VirtualMachine, R extends string> =
    | UpdateRegister<Pop<VM>, R, Top<VM>>;

/// Looks up for the value from the register R and pushes that onto the stack. If
/// the register R is not known, a `nil` value will be pushed onto the stack instead.
export type Load<VM extends VirtualMachine, R extends string> =
    | Push<VM, GetValueFromRegister<VM, R>>;

/// Pops two values from the stack, and if the two values are StringValues, concatenate
/// the two values and push the result onto the stack.
///
/// Panics if there isn't enough values on the stack.
export type Concat<VM extends VirtualMachine> =
    | [Top<VM>, Top<VM, 1>] extends [StringValue<infer R>, StringValue<infer L>] ? Push<Pop<Pop<VM>>, StringValue<`${L}${R}`>>
    : never;

/// Pops two values from the stack, and if the two values are equal, then push a `true`
/// value onto the stack, otherwise push a `false` onto the stack.
///
/// Panics if there isn't enough values on the stack.
export type Eq<VM extends VirtualMachine> = [Top<VM>, Top<VM, 1>] extends [infer R, infer L]
    ? Push<Pop<Pop<VM>>, BooleanValue<R & L extends never ? false : true>>
    : never;

/// Jumps to the designated label.
///
/// Does not panic.
export type Jmp<VM extends VirtualMachine, I extends InstructionPtr<number>> =
    | UpdateInstructionPtr<VM, I>;

/// Pops a value from the stack, and if it is an address, jump to it.
///
/// Panics if there isn't a value on the stack.
export type Ret<VM extends VirtualMachine> =
    | Top<VM> extends Address<infer N> ? UpdateInstructionPtr<VM, InstructionPtr<N>>
    : never;

/// Pushes the current instruction pointer on the stack, and then jump to the
/// designated label.
///
/// Does not panic.
export type Call<VM extends VirtualMachine, I extends InstructionPtr<number>> =
    | UpdateInstructionPtr<Push<VM, Address<GetInstructionPtrAddress<VM>>>, I>;

/// Jumps to the designated label if the top of the stack is a `true` value,
/// otherwise simply pops that value off the stack.
///
/// Does not panic. (author note: it should, but only if the top of the stack wasn't a boolean at all)
export type Je<VM extends VirtualMachine, I extends InstructionPtr<number>> = Top<Eq<VM>> & BooleanValue<true> extends never
    ? Pop<Eq<VM>>
    : Jmp<Pop<Eq<VM>>, I>;

/// Jumps to the designated label if the top of the stack is a `false` value,
/// otherwise simply pops that value off the stack.
///
/// Does not panic. (author note: it should, but only if the top of the stack wasn't a boolean at all)
export type Jne<VM extends VirtualMachine, I extends InstructionPtr<number>> = Top<Eq<VM>> & BooleanValue<false> extends never
    ? Pop<Eq<VM>>
    : Jmp<Pop<Eq<VM>>, I>;

export type Dispatch<VM extends VirtualMachine, I extends Instruction> =
    | I extends PushInstruction<infer N extends number> ? Push<VM, NumberValue<N>>
    : I extends PushInstruction<infer B extends boolean> ? Push<VM, BooleanValue<B>>
    : I extends PushInstruction<infer S extends string> ? Push<VM, StringValue<S>>
    : I extends PopInstruction ? Pop<VM>
    : I extends StoreInstruction<infer R> ? Store<VM, R>
    : I extends LoadInstruction<infer R> ? Load<VM, R>
    : I extends ConcatInstruction ? Concat<VM>
    : I extends EqInstruction ? Eq<VM>
    : I extends JmpInstruction<infer L> ? Jmp<VM, InstructionPtr<L>>
    : I extends RetInstruction ? Ret<VM>
    : I extends CallInstruction<infer L> ? Call<VM, InstructionPtr<L>>
    : I extends JeInstruction<infer L> ? Je<VM, InstructionPtr<L>>
    : I extends JneInstruction<infer L> ? Jne<VM, InstructionPtr<L>>
    : never;
