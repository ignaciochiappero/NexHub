// components\authComponents\SignupForm.tsx

"use client"

import { useForm, Controller } from "react-hook-form";

function SignupForm() {

    const {control, handleSubmit, formState: {errors} } = useForm({
        values: {
            email: "",
            password: "",
            name: "",
        }
    });
    
    const onSubmit = handleSubmit(data => {
        console.log(data);
    })


  return (
    <form onSubmit={onSubmit}>
        
        <div className="mt-32 border h-auto w-96 rounded-3xl flex flex-col items-center p-5 text-black">
            {/* contenedor email */}
            <div className="flex flex-col">

                <label 
                htmlFor="text"
                className="text-white"
                >
                    User Name
                </label>
                
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
                            
                            <input 
                            type="name" placeholder="Nombre_Usuario" autoFocus 
                            className="rounded-lg p-2 w-80"
                            {...field}
                            />
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

                <label 
                htmlFor="email"
                className="text-white"
                >
                    Email
                </label>
                
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
                            
                            <input 
                            type="email" placeholder="email@domain.com" autoFocus 
                            className="rounded-lg p-2 w-80"
                            {...field}
                            />
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
            <div className="flex mt-5 flex-col">

                <label 
                htmlFor="password"
                className="text-white"
                >
                    Password
                </label>
                
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
                            
                            <input 
                            type="password" placeholder="************" autoFocus 
                            className="rounded-lg p-2 w-80"
                            {...field}
                            />
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
            className="mt-10 bg-slate-400 p-2 rounded-2xl w-64">
                Registrar nuevo usuario
            </button>




        </div>
    </form>
  );
}

export default SignupForm;
