import { NextResponse } from "next/server";
import webpush from "web-push";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding)
    //.replace(/\\-/g, '+')
    .replace(/-/g, "+")
    .replace(/_/g, '/')
  alert(base64);
  if (typeof window === 'undefined') {
    alert('window undefined');
//      return Buffer.from(base64, 'base64')
  }
  if ( window == null) {
    alert('window null');
//      return Buffer.from(base64, 'base64')
  }
  const rawData = window.atob(base64)//Buffer.from(base64, 'base64')
  const outputArray = new Uint8Array(rawData.length)
 
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

webpush.setVapidDetails(
  "mailto:timtam54@hotmail.com", // Your email
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY! ,
  (process.env.NEXT_PUBLIC_VAPID_PRIVATE_KEY! ).toString()
);

export async function POST(req: Request) {
  const { message, subscription } = await req.json();

  if (!subscription) {
    return NextResponse.json(
      { error: "No subscription available" },
      { status: 400 }
    );
  }

  try {
    await webpush.sendNotification(
      subscription,
      JSON.stringify({ title: "Notification", body: message })
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending notification:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}