import { client } from "@/apollo/client";
import { userVar } from "@/apollo/store";

import { SIGN_UP } from "@/apollo/user/mutation";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

/* ================================
   TYPES
================================ */

interface CustomJwtPayload {
  _id: string;
  memberType: string;
  memberStatus: string;
  memberAuthType: string;
  memberPhone: string;
  memberNick: string;
  memberFullName: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberProperties: number;
  memberRank: number;
  memberArticles: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberWarnings: number;
  memberBlocks: number;
  exp: number;
}

/* ================================
   TOKEN STORAGE
================================ */

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("accessToken", token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync("accessToken");
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync("accessToken");
};

/* ================================
   SIGN UP
================================ */

interface SignUpResponse {
  signup: {
    accessToken: string;
  };
}

export const signUp = async (
  nick: string,
  password: string,
  phone: string,
  type: string
): Promise<void> => {
  try {
    const result = await client.mutate<SignUpResponse>({
      mutation: SIGN_UP,
      variables: {
        input: {
          memberNick: nick,
          memberPassword: password,
          memberPhone: phone,
          memberType: type,
        },
      },
    });

    const jwtToken = result.data?.signup.accessToken;

    if (!jwtToken) throw new Error("No token received");

    await saveToken(jwtToken);
    updateUserInfo(jwtToken);

    router.replace("/(tabs)/explore");
  } catch (err) {
    console.log("SignUp error:", err);
    throw err;
  }
};

/* ================================
   LOGIN
================================ */

// export const login = async (
//   nick: string,
//   password: string
// ): Promise<void> => {
//   try {
//     const result = await client.mutate({
//       mutation: LOGIN,
//       variables: {
//         input: {
//           memberNick: nick,
//           memberPassword: password,
//         },
//       },
//     });

//     const jwtToken = result?.data?.login?.accessToken;

//     if (!jwtToken) throw new Error("No token received");

//     await saveToken(jwtToken);
//     updateUserInfo(jwtToken);

//     router.replace("/(root)");
//   } catch (err) {
//     console.log("Login error:", err);
//     throw err;
//   }
// };

/* ================================
   UPDATE USER FROM JWT
================================ */

export const updateUserInfo = (jwtToken: string) => {
  const claims = jwtDecode<CustomJwtPayload>(jwtToken);

  userVar({
    _id: claims._id ?? "",
    memberType: claims.memberType ?? "",
    memberStatus: claims.memberStatus ?? "",
    memberAuthType: claims.memberAuthType ?? "",
    memberPhone: claims.memberPhone ?? "",
    memberNick: claims.memberNick ?? "",
    memberFullName: claims.memberFullName ?? "",
    memberImage: claims.memberImage ?? null,
    memberAddress: claims.memberAddress ?? "",
    memberDesc: claims.memberDesc ?? "",
    memberProperties: claims.memberProperties ?? 0,
    memberRank: claims.memberRank ?? 0,
    memberArticles: claims.memberArticles ?? 0,
    memberPoints: claims.memberPoints ?? 0,
    memberLikes: claims.memberLikes ?? 0,
    memberViews: claims.memberViews ?? 0,
    memberWarnings: claims.memberWarnings ?? 0,
    memberBlocks: claims.memberBlocks ?? 0,
  });
};

/* ================================
   AUTO LOGIN (CALL ON APP START)
================================ */

export const hydrateAuth = async () => {
  const token = await getToken();

  if (!token) return;

  const decoded = jwtDecode<CustomJwtPayload>(token);

  // Check expiration
  if (decoded.exp * 1000 < Date.now()) {
    await logOut();
    return;
  }

  updateUserInfo(token);
};

/* ================================
   LOGOUT
================================ */

export const logOut = async () => {
  await removeToken();

  userVar({
    _id: "",
    memberType: "",
    memberStatus: "",
    memberAuthType: "",
    memberPhone: "",
    memberNick: "",
    memberFullName: "",
    memberImage: null,
    memberAddress: "",
    memberDesc: "",
    memberProperties: 0,
    memberRank: 0,
    memberArticles: 0,
    memberPoints: 0,
    memberLikes: 0,
    memberViews: 0,
    memberWarnings: 0,
    memberBlocks: 0,
  });

  router.replace("/(auth)/welcome");
};
