import { MemberType } from "@/libs/enums/member.enum";

export function getRoleRoute(memberType: string): string {
  switch (memberType) {
    case MemberType.ADMIN:
      return "/(admin)/(tabs)/dashboard";
    case MemberType.VENDOR:
      return "/(vendor)/(tabs)/my-products";
    default:
      return "/(user)/(tabs)/home";
  }
}
