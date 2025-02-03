"use server";

import { auth, signIn, signOut } from "./auth";
import { updateGuest } from "./data-service";

export async function signInAction() {
  await signIn("google", {
    redirectTo: "/account",
  });
}
export async function signOutAction() {
  await signOut({
    redirectTo: "/",
  });
}
export async function updateGuestAction(formData) {
  const session = await auth();
  if (!session) throw new Error("You must be signed in to update your profile");
  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");
  if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID))
    throw new Error("Please Provide a valid national ID number");
  const updateData = {
    nationality,
    countryFlag,
    nationalID,
  };
  await updateGuest(session.user.guestId, updateData);
}
