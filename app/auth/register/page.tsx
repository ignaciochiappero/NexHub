//app\auth\register\page.tsx

import SignupForm from "@/components/authComponents/SignupForm";

function RegisterPage() {
    return (

        <div className="h-screen p-2 flex justify-center font-[family-name:var(--blender-medium)] text-2xl mt-10">
            
            <SignupForm/>
        
        </div>
    )
  }
  
  export default RegisterPage;