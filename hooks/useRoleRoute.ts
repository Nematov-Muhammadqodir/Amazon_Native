import { userVar } from "@/apollo/store";
import { getRoleRoute } from "@/libs/utils/getRoleRoute";
import { useReactiveVar } from "@apollo/client/react";

export function useRoleRoute() {
  const user = useReactiveVar(userVar);
  const homeRoute = getRoleRoute(user.memberType);

  return {
    homeRoute,
    memberType: user.memberType,
  };
}
