import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import { DatePicker } from "./date-picker";
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
  const [form, setForm] = useState({
    name: "",
    gender: "",
    dob: undefined as Date | undefined,
    profilePicture: undefined as File | undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>(
    {}
  );

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Add validation and submit logic here
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Profile created!");
    }, 1000);
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
              {isLoading ? "Creating..." : "Create Profile"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default NewProfileFormComponent;
