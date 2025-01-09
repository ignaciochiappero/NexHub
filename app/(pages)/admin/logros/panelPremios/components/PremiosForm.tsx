// app/tasks/components/TaskForm.tsx

"use client";


import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { useRouter } from "next/navigation";


function LogrosForm() {

    const {control, handleSubmit, reset } = useForm({
        values: {
            titulo: "",
            descripcion: ""
        }
    });

    const router = useRouter();

    const onSubmit = handleSubmit(async(data) => {
        const res = await axios.post("/api/premios", data);

        //si la tarea fue creada con éxito entonces redireccionar
         if (res.status === 201) {
             
            console.log(res);
            reset(); // Resetea el formulario
            router.refresh();
         }
    })





  return (
<div>
    {/* New Premios Section */}
    <div className="pt-40 mb-6 flex items-center space-x-4 px-20  justify-center">
        

        
        <div className="p-4 bg-[#353535] rounded-2xl">
        
            <form 
            onSubmit={onSubmit}
            className="flex-grow">

                <Controller
                    name="titulo"   
                    control={control}
                    render ={({field}) => {
                        return (

                            <input 
                            {...field}
                            placeholder="Título del premio"
                            className="w-full bg-[#454545] text-white p-3 rounded-xl resize-none"
                            
                            />
                        )
                    }}                
                
                
                />



                <Controller
                    name="descripcion"   
                    control={control}
                    render ={({field}) => {
                        return (

                            <textarea 
                            {...field}
                            placeholder="Descripción del premio"
                            className=" mt-4 w-full bg-[#454545] text-white p-3 rounded-xl resize-none"
                            rows={3}
                            />
                        )
                    }}                
                
                
                />

                <button 
                    className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
                >
                    Agregar
                </button>
            </form>
        </div>


    </div>






    </div>
  )
}

export default LogrosForm;