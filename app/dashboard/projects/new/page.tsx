"use client";

import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { useRouter } from "next/navigation";

function TaskNewPage() {
  const { control, handleSubmit } = useForm({
    values: {
      title: "",
      description: "",
    },
  });

  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const res = await axios.post("/api/projects", data);

    if (res.status === 201) {
      router.push("/dashboard");
      router.refresh();
    }
  });

  return (
    <div className="flex items-center justify-center mt-20 font-[family-name:var(--blender-bold)] flex-col">
      <p className="text-3xl">Task Page</p>

      <div className="mt-20 flex flex-col">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-5 p-5 rounded-lg bg-stone-800 w-[500px] text-stone-700"
        >
          <Controller
            name="title"
            control={control}
            render={({ field }) => {
              return (
                <input
                  {...field}
                  type="text"
                  placeholder="Title"
                  className="p-2 rounded-lg"
                />
              );
            }}
          />

          <Controller
            name="description"
            control={control}
            render={({ field }) => {
              return (
                <textarea
                  {...field}
                  placeholder="Description"
                  className="p-2 rounded-lg h-40"
                />
              );
            }}
          />

          <button className="bg-blue-600 hover:bg-blue-500   transition-all  p-2 rounded-lg text-white">
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}

export default TaskNewPage;
