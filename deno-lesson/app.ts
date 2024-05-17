/*
deno run --allow-write=message.txt app.ts
this give deno permission to write to the file system to message.txt file

Deno does not have all system permissions by default, you have to give it permission to do certain things
It is secure by default

With Node, you have all the permissions by default, which is not secure
*/

const text = 'This is a text - and it should be stored in a file!';

const encoder = new TextEncoder(); // this object helps us convert text to bites (string to Uint8Array), which is what the file system understands
const data = encoder.encode(text); // we encode the text to Uint8Array

Deno.writeFile('message.txt', data).then(() => {
  console.log('Wrote to file!');
});


