"use client";

import BackHeader from "../../ui/backHeader";
import SignIn from "../../ui/sign/sign-in";

export default function SignInPage() {
  return (
    <>
      <div className="w-full h-full flex flex-col ">
        <BackHeader title="sign in" />
        <div className="flex-1 flex justify-center items-center">
          <SignIn></SignIn>
        </div>
      </div>
    </>
  );
}
