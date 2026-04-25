import {ReactNode} from "react";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

export default AuthLayout;
