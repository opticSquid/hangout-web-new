import { DoesProfileExist } from "@/lib/services/profile-service";
import { useEffect, type ReactElement } from "react";
import { useNavigate } from "react-router";
import NewProfileFormComponent from "../components/new-profile-form";
import LoadingOverlay from "../components/loading-overlay";
import { useState } from "react";

function NewProfilePage(): ReactElement {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkProfile() {
      const response: boolean = await DoesProfileExist();
      if (response) {
        navigate("/", { replace: true });
      } else {
        setLoading(false);
      }
    }
    checkProfile();
  }, []);
  if (loading) {
    return <LoadingOverlay message="Checking your profile..." />;
  }
  return <NewProfileFormComponent />;
}

export default NewProfilePage;
