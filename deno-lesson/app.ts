/*
deno run --allow-write=message.txt app.ts
this give deno permission to write to the file system to message.txt file

Deno does not have all system permissions by default, you have to give it permission to do certain things
It is secure by default

With Node, you have all the permissions by default, which is not secure
*/

/*
Core and features organization

Deno Namespace APIs (built-in utilities)
    - stable and maintained by core team
    - built into deno, no need to import
    - only small set of low-level core functionalities

Standard Library (mantained by deno team) (deno.land/std)
    - unstable and maintained by core team
    - not built into deno, but can be imported 
    - builds up on core APIs, low-level functionalities to make it easier-to-use

Third Party Modules (mantained by the community)
    -stability differs, maintained by the community
    - not built into deno, but can be imported
    - builds up on core APIs, low-level functionalities to make it easier-to-use
*/

// Deno namespace APIs demonstration
/**
deno run --allow-write=message.txt --allow-net app.ts
*/
const text = 'This is a text - and it should be stored in a file!';

const encoder = new TextEncoder(); // this object helps us convert text to bites (string to Uint8Array), which is what the file system understands
const data = encoder.encode(text); // we encode the text to Uint8Array

Deno.writeFile('message.txt', data).then(() => {
  console.log('Wrote to file!');
});

// Standard Library demonstration
// this is not std library anymore
/*
deno run --allow-write=message.txt --allow-net app.ts
*/
const port = 3000; // port number
const handler = (_req: Request): Response => new Response("Hello Deno!"); // handler function
Deno.serve({ port }, handler); // serve the handler function on the port number. This is a simple server




