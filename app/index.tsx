import { userVar } from "@/apollo/store";
import "@/global.css";
import { hydrateAuth } from "@/libs/auth";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function InitialEnter() {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    async function init() {
      await hydrateAuth();
      setChecked(true);
    }

    init();
  }, []);

  if (!checked) return null;

  const user = userVar();

  if (user._id) {
    return <Redirect href="/(root)/(tabs)/home" />;
  }

  return <Redirect href="/sign-up" />;
}
