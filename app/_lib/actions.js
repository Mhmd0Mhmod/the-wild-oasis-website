"use server";

import {revalidatePath} from "next/cache";
import {auth, signIn, signOut} from "./auth";
import {
    createBooking, deleteBooking, getBookings, updateBooking, updateGuest,
} from "./data-service";
import {redirect} from "next/navigation";

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
    if (!/^[a-zA-Z0-9]{6,12}$/.test(nationalID)) throw new Error("Please Provide a valid national ID number");
    const updateData = {
        nationality, countryFlag, nationalID,
    };
    await updateGuest(session.user.guestId, updateData);
    revalidatePath("/account/profile");
}

export const createReservationAction = async (bookingData, formData) => {
    const session = await auth();
    if (!session) throw new Error("You must be signed in to update your profile");

    const newBooking = {
        ...bookingData,
        guestId: session.user.guestId,
        numGuests: Number(formData.get("numGuests")),
        observations: formData.get("observations").slice(0, 1000),
        extrasPrice: 0,
        totalPrice: bookingData.cabinPrice,
        isPaid: false,
        hasBreakfast: false,
        status: "unconfirmed"
    }
    try {
        await createBooking(newBooking)
    } catch (e) {
        throw e;
    }

    revalidatePath(`/cabins/${bookingData.cabinId}`);
    redirect("/cabins/thankyou");
};

export const deleteReservationAction = async (bookingId) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const session = await auth();
    if (!session) throw new Error("You must be signed in to update your profile");
    const guestBookings = await getBookings(session.user.guestId);
    if (!guestBookings.find((booking) => booking.id === bookingId)) throw new Error("You don't have permission to delete this booking");
    try {
        await deleteBooking(bookingId);
        revalidatePath("/account/reservations");
    } catch (e) {
        console.error(e);
    }
};

export async function updateReservation(formData) {
    console.log(formData);

    // Authentication
    const session = await auth();
    if (!session) throw new Error("You must be signed in to update your profile");

    const bookingId = Number(formData.get("bookingId"));
    // Authorization
    const guestBookings = await getBookings(session.user.guestId);
    if (!guestBookings.find((booking) => Number(booking.id) === bookingId)) throw new Error("You don't have permission to delete this booking");
    // updateing
    const updateData = {
        numGuests: Number(formData.get("numGuests")), observations: formData.get("observations").slice(0, 1000),
    };
    await updateBooking(bookingId, updateData);
    // revaildate
    revalidatePath(`/account/reservations/edit/${bookingId}`);
    // redirect
    redirect("/account/reservations");
}
