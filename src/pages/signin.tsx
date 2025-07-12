import SigninFormComponent from "@/components/signin-form";
import TrustDeviceAlertComponent from "@/components/trust-device-alert";
import { useAccessTokenContextHandler } from "@/lib/hooks/useAccessToken";
import type { AccessTokenObject } from "@/lib/types/access-token";
import { useState, type ReactElement } from "react";
import { useNavigate } from "react-router";

function SigninPage(): ReactElement {
  const accessTokenContextHandler = useAccessTokenContextHandler();
  const navigate = useNavigate();
  const [openNotTrustedAlert, setOpenNotTrustedAlert] =
    useState<boolean>(false);
  const handleResult = (context: AccessTokenObject) => {
    accessTokenContextHandler.setAccessToken(context.accessToken);
    // trustedDevice is false by default in context
    accessTokenContextHandler.setTrustedDevice(context.trustedDevice);
    if (context.trustedDevice === false) {
      setOpenNotTrustedAlert(true);
    } else {
      navigate("/");
    }
  };

  const onAlertClose = () => {
    console.log("Trust alert closed");
    setOpenNotTrustedAlert(false);
  };

  return (
    <>
      <SigninFormComponent
        handleSigninResult={handleResult}
        setOpenNotTrustedAlert={setOpenNotTrustedAlert}
      />
      <TrustDeviceAlertComponent
        shouldOpen={openNotTrustedAlert}
        onClose={onAlertClose}
        handleTrustResult={handleResult}
      />
    </>
  );
}
export default SigninPage;
