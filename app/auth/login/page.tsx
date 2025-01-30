import SigninForm from "@/components/authComponents/SigninForm";

function LoginPage() {
  return (
    <div className="bg-[#1A1A1A] min-h-screen p-6 flex justify-center font-[family-name:var(--blender-medium)] text-2xl">
      <SigninForm />
    </div>
  );
}

export default LoginPage;
