

// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { withAuth } from "next-auth/middleware"

export default withAuth(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function middleware(request: NextRequest) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  },
)

export const config = { matcher: ["/dashboard/:path*"] }



//acá se pone la ruta la cual queremos proteger, si creamos en este caso una carpeta llamada dashboard, protege todo lo que está dentro de ella


//SI LO PONEMOS ASÍ SOLAMENTE PROTEGE
//ESA CARPETA PERO NO LO QUE TENGA 
//DENTRO COMO SUBCARPETAS
//export const config = { matcher: ["/dashboard"] };