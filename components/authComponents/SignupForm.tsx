// components\authComponents\SignupForm.tsx

"use client"

import { useForm, Controller } from "react-hook-form";
import { Lock, User, Mail } from 'lucide-react';
import axios from "axios";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";


function SignupForm() {

    const {control, handleSubmit, formState: {errors} } = useForm({
        values: {
            email: "",
            password: "",
            name: "",
        }
    });


    const router = useRouter();
    
    const onSubmit = handleSubmit(async (data) => {

        const response = await axios.post('/api/auth/register', data);

        router.push('/admin/users');

        // if (response.status === 201) {
            
        //     const result = await signIn('credentials', {
        //         email: response.data.email,
        //         password: data.password,
        //         redirect: false
        //     })

        //     if (!result.ok) {
        //         console.log(result.error);
        //         return;
        //     }


        //     /* Esto redirecciona al panel de registro */
        //     router.push('/admin/users');


        // }
    })


  return (
    <form onSubmit={onSubmit}>
        
        <div className="bg-[#353535] rounded-2xl p-8 w-full max-w-md shadow-lg mt-48">
            {/* contenedor email */}
            <div className="flex flex-col">


                
                <Controller 
                    name="name"
                    control={control}
                    rules= {{
                        required: {
                            message: "El nombre es requerido",
                            value:true
                        }
                    }}
                    render = {({field}) => {
                        return (
                            
                            <div className="relative">

                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        
                            <input 
                            type="name" placeholder="Nombre Usuario" autoFocus 
                            className="pl-10 text-lg rounded-lg p-2 w-80 bg-[#454545] text-white "
                            {...field}
                            />
                        
                        </div>      
                        );
                    }}
                
                />

                {
                    errors.name &&
                    <span className="text-red-300 text-lg">
                        {errors.name.message}
                    </span>
                }
            </div>

            {/* contenedor email */}
            <div className="flex mt-5 flex-col" >


                
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
                        
                        </div>                        );
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
            <div className="flex mt-5 flex-col">


                
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
            Registrar usuario
            </button>



        </div>
    </form>
  );
}

export default SignupForm;
