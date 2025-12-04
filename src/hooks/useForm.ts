import { verifyCaptcha } from "@/actions/verifyCaptcha";
import React from "react";

const useForm = ({
  parseBody,
  submitOnEmail,
  beforeSubmit,
  onSubmit,
}: {
  submitOnEmail: string;
  parseBody: (data: Record<string, string>) => string;
  beforeSubmit?: (data: Record<string, string>) => void | Promise<void>;
  onSubmit?: () => void | Promise<void>;
}) => {
  const recaptchaRef = React.useRef<any>(null);
  const [isUnknownError, setIsUnknownError] = React.useState(false);
  const [isDone, setIsDone] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [recaptchaToken, setRecaptchaToken] = React.useState<string | null>(
    null,
  );

  const getCaptchaToken = React.useCallback(async () => {
    if (recaptchaToken) {
      return recaptchaToken;
    }

    const token = await recaptchaRef.current.executeAsync();
    setRecaptchaToken(token);

    return token;
  }, [recaptchaToken]);

  const handleFormSubmit = async (data: Record<string, string>) => {
    setIsUnknownError(false);
    setIsLoading(true);

    const token = await getCaptchaToken();

    const isCaptchaValid = await verifyCaptcha(token);

    if (!isCaptchaValid) {
      console.error("Captcha can't be verified. Aborting the form submit");
      setIsUnknownError(true);
      setIsLoading(false);
      return;
    }

    try {
      if (beforeSubmit) {
        await beforeSubmit(data);
      }

      const response = await fetch(
        `https://formsubmit.co/ajax/${submitOnEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: parseBody(data),
        },
      );

      if (response.ok) {
        setIsDone(true);
        if (onSubmit) {
          await onSubmit();
        }
      } else {
        setIsUnknownError(true);
        console.error("Failed to submit the form");
        console.error("Reason:");
        console.error(await response.text());
      }
    } catch (error) {
      setIsUnknownError(true);
      console.error("Failed to submit the form");
      console.error("Reason:");
      console.error(error);
    }

    setIsLoading(false);
  };

  return {
    recaptchaRef,
    isUnknownError,
    isDone,
    isLoading,
    setRecaptchaToken,
    handleFormSubmit,
  };
};

export default useForm;
