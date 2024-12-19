//middleware.ts


export { default } from "next-auth/middleware";

export const config = { matcher: ["/dashboard"] };
//acá se pone la ruta la cual queremos proteger, si creamos en este caso una carpeta llamada dashboard, protege todo lo que está dentro de ella
