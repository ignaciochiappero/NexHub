//middleware.ts


export { default } from "next-auth/middleware";




export const config = { matcher: ["/dashboard/:path*"] };
//acá se pone la ruta la cual queremos proteger, si creamos en este caso una carpeta llamada dashboard, protege todo lo que está dentro de ella


//SI LO PONEMOS ASÍ SOLAMENTE PROTEGE
//ESA CARPETA PERO NO LO QUE TENGA 
//DENTRO COMO SUBCARPETAS
//export const config = { matcher: ["/dashboard"] };