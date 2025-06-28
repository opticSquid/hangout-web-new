import type { LoginFormErrors, LoginFormSchema } from "@/lib/types/login";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import { Link } from "react-router";
import LoadingOverlay from "./loading-overlay";
import PasswordInputComponent from "./password-input";
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
import type { ApiResponse } from "@/lib/types/ApiResponse";

function LoginFormComponent(): ReactElement {
  const [form, setForm] = useState<LoginFormSchema>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [apiError, setApiError] = useState<ApiResponse<undefined>>();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };
  const validate = (data: LoginFormSchema): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};
    if (data.username.length < 2) {
      newErrors.username =
        "Username must me more than or equal to 2 characters";
    } else if (data.username.length >= 50) {
      newErrors.username = "Username must be less than 50 characters";
    }
    if (data.password.length < 7) {
      newErrors.password =
        "Password must be more than or equal to 7 characters";
    } else if (data.password.length >= 16) {
      newErrors.password = "Password must be less than 16 characters";
    }
    return newErrors;
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      setIsLoading(true);
      // Simulate API call
      await new Promise((res) => setTimeout(res, 5000));
      console.log("Logging in with", form);
      // Navigate or save token here
    } catch (err) {
      setApiError({
        error: {
          message: "Failed to sign in.",
          status: 500,
          details: "Something went wrong",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-4/5">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="h-full w-full grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>
            <div className="grid gap-2">
              {/* name to passwordInput and label html for should be same */}
              <Label htmlFor="password">Password</Label>
              <PasswordInputComponent
                name="password"
                value={form.password}
                handleChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              Login
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          Don&apos;t have an account?&nbsp;
          <Link
            to="/sign-up"
            className="text-primary underline-offset-4 hover:underline"
          >
            Signup
          </Link>
        </CardFooter>
      </Card>
      {isLoading && <LoadingOverlay message="getting entry pass..." />}
    </div>
  );
}
export default LoginFormComponent;
