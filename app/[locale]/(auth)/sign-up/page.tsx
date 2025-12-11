"use client";

import BackHeader from "../../ui/backHeader";

import SignUp from "../../ui/sign/sign-up";

export default function SignUpPage() {
  return (
    <>
      <div className="w-full h-full flex flex-col ">
        <BackHeader title="sign up" />
        <div className="flex-1 flex justify-center items-center">
          <SignUp />
        </div>
      </div>
    </>
  );
}
