import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import React from "react";

const SignUpPage = () => {
  return (
    <main className="h-screen w-full items-center justify-center flex">
      <ClerkLoaded>
        <SignUp
          appearance={{
            elements: {
              footer: "hidden",
            },
          }}
        />
      </ClerkLoaded>
      <ClerkLoading>
        <Loader2 className="animate-spin text-muted-foreground" />
      </ClerkLoading>
    </main>
  );
};

export default SignUpPage;
