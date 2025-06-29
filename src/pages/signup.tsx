import EmailVerificationAlert from "@/components/email-verification-alert";
import SignupFromComponent from "@/components/signup-form";
import { useState, type ReactElement } from "react";

function SignUpPage(): ReactElement {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  return (
    <>
      <SignupFromComponent setShowAlert={setShowAlert} />
      {showAlert && <EmailVerificationAlert isOpen={showAlert} />}
    </>
  );
}
export default SignUpPage;
