"use client";
import ReservationCard from "@/app/account/reservations/ReservationCard";
import { useOptimistic } from "react";
import { deleteReservationAction as deleteReservation } from "../_lib/actions";
function ReservationLIst({ bookings }) {
  const [optimisticBookings, optimisticDelte] = useOptimistic(
    bookings,
    (curBookings, bookingId) => {
      return curBookings.filter((booking) => booking.id !== bookingId);
    }
  );
  async function handleDelete(bookingId) {
    optimisticDelte(bookingId);
    await deleteReservation(bookingId);
  }
  return (
    <ul className="space-y-6">
      {optimisticBookings.map((booking) => (
        <ReservationCard
          onDelete={handleDelete}
          booking={booking}
          key={booking.id}
        />
      ))}
    </ul>
  );
}

export default ReservationLIst;
