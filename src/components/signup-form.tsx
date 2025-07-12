import type { ProblemDetail } from "@/lib/types/model/problem-detail";
import type { SignupFormProps } from "@/lib/types/props/signup-form-props";
import type { SignupFormErrors, SignupFormSchema } from "@/lib/types/signup";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactElement,
} from "react";
import { Link } from "react-router";
import ErrorComponent from "./error";
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
import { Signup } from "@/lib/services/signup-service";

function SignupFromComponent(props: SignupFormProps): ReactElement {
  const [form, setForm] = useState<SignupFormSchema>({
    username: "",
    email: "",
    password: "",
    reenteredPassword: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<SignupFormErrors>({});
  const [apiError, setApiError] = useState<ProblemDetail>();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validate = (data: SignupFormSchema): SignupFormErrors => {
    const newErrors: SignupFormErrors = {};
    if (data.username.length < 2) {
      newErrors.username =
        "Username must me more than or equal to 2 characters";
    } else if (data.username.length >= 50) {
      newErrors.username = "Username must be less than 50 characters";
    }

    if (data.email === "") {
      newErrors.email = "Email can not be empty";
    } else {
      const emailRegex = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      const res = emailRegex.test(data.email);
      if (res === false) {
        newErrors.email = "This is not a valid email address";
      }
    }

    if (data.password.length < 7) {
      newErrors.password =
        "Password must be more than or equal to 7 characters";
    } else if (data.password.length >= 16) {
      newErrors.password = "Password must be less than 16 characters";
    }

    if (data.reenteredPassword !== data.password) {
      newErrors.reenteredPassword =
        "This password and original password does not match";
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
      await Signup(form);
      props.setShowAlert(true);
    } catch (err) {
      const problem = err as ProblemDetail;
      setApiError(problem);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-4/5">
        <CardHeader>
          <CardTitle>Signup</CardTitle>
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
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
            <div className="grid gap-2">
              {/* name to passwordInput and label html for should be same */}
              <Label htmlFor="reenteredPassword">Confirm Password</Label>
              <PasswordInputComponent
                name="reenteredPassword"
                value={form.reenteredPassword}
                handleChange={handleChange}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.reenteredPassword}
                </p>
              )}
            </div>
            <Button type="submit" disabled={isLoading}>
              Sign up
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          Already have an account?&nbsp;
          <Link
            to="/sign-in"
            className="text-primary underline-offset-4 hover:underline"
          >
            Login
          </Link>
        </CardFooter>
      </Card>
      {isLoading && <LoadingOverlay message="Lets HangOut!!!" />}
      {apiError && <ErrorComponent error={apiError} setError={setApiError} />}
    </div>
  );
}

export default SignupFromComponent;
