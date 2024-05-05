'use client'
import { useState, useRef, useEffect } from "react";
import {
  KnockProvider,
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react/dist/index.css";
import { useSession } from "next-auth/react";
import { BellIcon } from "@knocklabs/react";

const YourAppLayout = () => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);
//   const {data:session, status } = useSession() ;
  const [isClient, setIsClient] = useState(false);

  useEffect(()=>{
    setIsClient(true)
  },[]) ;
  return (
    isClient? (
    <KnockProvider
      apiKey={'pk_test_Ax_i6ljR5VM2fSvZMPQb-HTMaLqIcKKT8R0shGLjFWE'}
      //@ts-ignore
    //   userId={session.user.id}
      userId={'123'}
    >
      <KnockFeedProvider feedId={'762945c7-2f67-4c35-ad40-1cc43ad63574'}>
        <>
          <NotificationIconButton
            ref={notifButtonRef}
            onClick={(e) => setIsVisible(!isVisible)}
          />
          <NotificationFeedPopover
            buttonRef={notifButtonRef}
            isVisible={isVisible}
            onClose={() => setIsVisible(false)}
          />
        </>
      </KnockFeedProvider>
    </KnockProvider>)
     : <BellIcon aria-hidden="true"/>
  );
};


export default  YourAppLayout;