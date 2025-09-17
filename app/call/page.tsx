import { redirect } from "next/navigation";

export default function CallRedirect() {
  // Redirect to Google Calendar
  redirect(process.env.NEXT_PUBLIC_BOOKING_URL ?? "");
}
