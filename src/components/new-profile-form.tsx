import { CreateProfile } from "@/lib/services/profile-service";
import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { ProfileSchema } from "@/lib/types/profile";
import { FormatDate } from "@/lib/utils/date-utils";
import { CheckCircle2Icon } from "lucide-react";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { DatePicker } from "./date-picker";
import ErrorComponent from "./error";
import LoadingOverlay from "./loading-overlay";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function NewProfileFormComponent(): ReactElement {
  const navigate = useNavigate();
  const [form, setForm] = useState<ProfileSchema>({
    name: "",
    gender: "",
    dob: undefined,
    profilePicture: undefined,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );
  const [apiError, setApiError] = useState<ProblemDetail>();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "profilePicture" && files) {
      setForm((prev) => ({ ...prev, profilePicture: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setForm((prev) => ({ ...prev, dob: date }));
    setErrors((prev) => ({ ...prev, dob: undefined }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("gender", form.gender);
      // also check if dob is from future
      if (form.dob) {
        formData.append("dob", form.dob.toISOString());
        if (form.dob > new Date()) {
          setErrors((prev) => ({
            ...prev,
            dob: "Date of birth cannot be in the future",
          }));
        }
      }
      if (form.profilePicture) {
        formData.append("profile-picture", form.profilePicture);
      }
      CreateProfile(formData)
        .then(() => {
          toast.success("Profile created successfully!", {
            description: FormatDate(new Date()),
            duration: 3500,
            icon: <CheckCircle2Icon />,
          });
        })
        .then(() => {
          navigate("/", { replace: true });
        });
    } catch (error) {
      const problem = error as ProblemDetail;
      setApiError(problem);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-4/5">
        <CardHeader>
          <CardTitle>Create Profile</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="h-full w-full grid gap-y-6">
          <CardContent className="grid gap-y-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <span className="text-red-500 text-xs">{errors.name}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                name="gender"
                value={form.gender}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, gender: value }))
                }
                defaultValue="other"
                required
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="How do you indentify" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Gender</SelectLabel>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.gender && (
                <span className="text-red-500 text-xs">{errors.gender}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <DatePicker date={form.dob} setDate={handleDateChange} />
              {errors.dob && (
                <span className="text-red-500 text-xs">{errors.dob}</span>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="profilePicture">Profile Picture</Label>
              <Input
                id="profilePicture"
                name="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleChange}
              />
              {errors.profilePicture && (
                <span className="text-red-500 text-xs">
                  {errors.profilePicture}
                </span>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              Create Profile
            </Button>
          </CardFooter>
        </form>
      </Card>
      {isLoading && <LoadingOverlay message="Creating your Profile..." />}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </div>
  );
}

export default NewProfileFormComponent;
