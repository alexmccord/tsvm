import { FreshVM, Parse, Interpret } from "./src";

type Ast = Parse<`
    fn main() {
        let x = hello_world()
        return if x == 'hello world!' then 0 else 1
    }

    fn hello_world() {
        return 'hello world!'
    }
`>;

// type Bytecode = Compile<Ast>;

type EndVM = Interpret<FreshVM, {}>;
