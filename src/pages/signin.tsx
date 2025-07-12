import SigninFormComponent from "@/components/signin-form";
import { useAccessTokenContext } from "@/lib/hooks/useAccessToken";
import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router";

function SigninPage(): ReactElement {
  const accessTokenContext = useAccessTokenContext();
  const navigate = useNavigate();
  useEffect(() => {
    accessTokenContext.getAccessToken() !== null && navigate(-1);
  }, []);
  return <SigninFormComponent />;
}
export default SigninPage;
