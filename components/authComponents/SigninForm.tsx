//components\authComponents\SigninForm.tsx
"use client"

import { useForm, Controller } from "react-hook-form";
import Image from "next/image";
import { Lock, Mail } from 'lucide-react';

function SigninForm() {

    const {control, handleSubmit, formState: {errors} } = useForm({
        values: {
            email: "",
            password: "",
        }
    });
    
    const onSubmit = handleSubmit(data => {
        console.log(data);
    })

  return (
    <form onSubmit={onSubmit}>

        <div className="bg-[#353535] rounded-2xl p-8 w-full max-w-md shadow-lg mt-48">

        <div className="text-center mb-8">
          <Image 
            src="/perfil-n-d.png" 
            alt="Profile" 
            width={100} 
            height={100} 
            className="mx-auto rounded-full mb-4"
          />
          <h1 className="text-3xl font-bold text-white">
           Iniciar Sesión
          </h1>
        </div>

        {/* contenedor email */}
        <div className="flex flex-col ">

            

            
            <Controller 
                name="email"
                control={control}
                rules= {{
                    required: {
                        message: "El email es requerido",
                        value:true
                    }
                }}
                render = {({field}) => {
                    return (

                        <div className="relative">

                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        
                            <input 
                            type="email" placeholder="email@domain.com" autoFocus 
                            className="pl-10 text-lg rounded-lg p-2 w-80 bg-[#454545] text-white "
                            {...field}
                            />
                        
                        </div>

                        
                    );
                }}
            
            />

            {
                errors.email &&
                <span className="text-red-300 text-lg">
                    {errors.email.message}
                </span>
            }
        </div>


        {/* contenedor password */}
        <div className="mt-5 flex flex-col">


            
            <Controller 
                name="password"
                control={control}
                rules= {{
                    required: {
                        message: "La contraseña es requerida",
                        value:true
                    },
                    minLength: {
                        value: 8,
                        message: "La contraseña debe tener al menos 8 caracteres",
                    },
                }}
                render = {({field}) => {
                    return (
                        <div className="relative">

                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                            <input 
                            type="password" placeholder="Contraseña" autoFocus 
                            className="rounded-lg pl-10 items-center flex justify-center text-lg p-2 w-80 bg-[#454545] text-white "
                            {...field}
                            />

                        </div>
                    );
                }}
            
            />

            {
                errors.password &&
                <span className="text-red-300 text-lg">
                    {errors.password.message}
                </span>
            }
        </div>

        <button 
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-full hover:bg-pink-700 transition text-lg mt-3"
          >
            Entrar
          </button>




        </div>



    </form>
  );
}

export default SigninForm;
