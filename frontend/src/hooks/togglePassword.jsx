import { useState } from "react";

export default function usePassword() {
  const [password, setPassword] = useState(false);
  const togglePassword = () => {
    setPassword(!password);
  };
  return { password, togglePassword };
}
