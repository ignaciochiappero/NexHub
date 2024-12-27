
"use client";

import Image from "next/image"

import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { useRouter } from "next/navigation";


function PostSection() {

    const {control, handleSubmit, reset } = useForm({
        values: {
            content: ""
        }
    });

    const router = useRouter();

    const onSubmit = handleSubmit(async(data) => {
        const res = await axios.post("/api/posts", data);

        //si la tarea fue creada con éxito entonces redireccionar
         if (res.status === 201) {
             
            console.log(res);
            reset(); // Resetea el formulario
            router.refresh();
         }
    })





  return (
    <div>
                {/* New Post Section */}
                <div className="mb-6 flex items-center space-x-4">
                  
                  <Image 
                    src="/perfil-n-d.png" 
                    alt="Profile" 
                    width={50} 
                    height={50} 
                    className="rounded-full"
                  />
                  
                  
                  <form 
                  onSubmit={onSubmit}
                  className="flex-grow">

                    <Controller
                        name="content"   
                        control={control}
                        render ={({field}) => {
                            return (

                                <textarea 
                                {...field}
                                placeholder="What's on your mind?"
                                className="w-full bg-[#454545] text-white p-3 rounded-xl resize-none"
                                rows={3}
                              />
                            )
                        }}                
                    
                    
                    />

                    <button 
                      className="mt-2 bg-pink-600 text-white px-4 py-2 rounded-full hover:bg-pink-700 transition"
                    >
                      Post
                    </button>
                  </form>


                </div>






    </div>
  )
}

export default PostSection;