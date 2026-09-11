import { useMemo } from "react";

interface Props {
  password: string;
}

export const usePasswordStrengthIndicator = ({ password }: Props) => {
  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
      { regex: /[^\w\s]/, text: "At least 1 special character" },
    ];

    return requirements.map((requirement) => ({
      met: requirement.regex.test(pass),
      text: requirement.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(
    () => strength.filter((requirement) => requirement.met).length,
    [strength],
  );

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score <= 3) return "Medium password";
    if (score <= 4) return "Strong password";
    return "Very strong password";
  };

  return {
    strength,
    strengthScore,
    getStrengthText,
  };
};
