//components\authComponents\SigninForm.tsx
"use client"

import { useForm, Controller } from "react-hook-form";

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

        <div className="mt-32 border h-96 w-96 rounded-3xl flex flex-col items-center p-5 text-black">

        {/* contenedor email */}
        <div className="flex flex-col">

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
        <div className="mt-5 flex flex-col">

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
            Ingresar
        </button>




        </div>



    </form>
  );
}

export default SigninForm;
