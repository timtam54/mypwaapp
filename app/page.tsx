"use client"

import { useEffect, useState } from "react";

export default function Home() {

  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useEffect(() => {
    
  }, []);


  const beginreg=()=>{
    if ("serviceWorker" in navigator && "PushManager" in window) {
      alert('registering');
      registerServiceWorker();
      
    }
  }

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", { //provide the route to the service worker
      scope: "/",
      updateViaCache: "none",
    });
    //registration.showNotification('Hello, world!');
    const sub = await registration.pushManager.getSubscription();

    if (sub) {
      alert('existing subscription');
      setSubscription(sub); //This would be sent to a server
    } else {
      alert('new subscription');
      const pk= urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY! )
      alert(pk);
      const registration2 = await navigator.serviceWorker.ready
      const pushSubscription = await registration2.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: pk,//urlBase64ToUint8Array // Your VAPID public key
      });

      setSubscription(pushSubscription);
      //await subscribeUser(sub)
    }
  }


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
//Create a function to test the notification
  const handleSendNotification = async () => {
    try{
   const req= await fetch("/api/sendNotification", {
      method: "POST",
      body: JSON.stringify({
        message: "Your timer has completed!",
        subscription: subscription, // This ideally, should not be included in the body. It should have already been saved on the server
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const resp = await req.json();
    console.table(resp);
   
      alert('response success:'+resp.success);
    
  }
  catch(ex:any){
    alert(ex.message);
  }
  };

  return (
    <div>
      <img src="/logo192.png" />
      <button onClick={(e:any)=>{e.preventDefault();beginreg();}}>register</button>
      {subscription ? <>
      <h1>My PWA with Push Notifications</h1>
      <button onClick={handleSendNotification}>Notify Me!</button>
      </>:<>setting up push</>}
    </div>
  );
};