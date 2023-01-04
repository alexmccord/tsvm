import { FreshVM, Parse, Interpret, Compile } from "./src";

type MyAst = Parse<`
fn main() {
    let x = hello_world()
    return if x == 'hello world!' then 0 else 1
}

fn hello_world() {
    return 'hello world!'
}
`>;

type MyBytecode = Compile<MyAst>;

type EndVM = Interpret<FreshVM, MyBytecode>;
