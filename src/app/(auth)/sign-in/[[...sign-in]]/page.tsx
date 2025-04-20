import { ClerkLoaded, ClerkLoading, SignIn } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import React from "react";

const SignInPage = () => {
  return (
    <main className="h-screen w-full items-center justify-center flex">
      <ClerkLoaded>
        <SignIn
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
export default SignInPage;
