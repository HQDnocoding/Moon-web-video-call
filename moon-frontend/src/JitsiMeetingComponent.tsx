import { JitsiMeeting } from "@jitsi/react-sdk";
import React from "react";

const JitsiMeetingComponent = () => {
    return (
        <div style={{height:"100vh",width:"100vh",display:"grid",flexDirection:'column'}}>
            <JitsiMeeting
                domain={"meet.jit.si"}
                roomName="PleaseUseAGoodRoomName"
                configOverwrite={{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: true,
                    startScreenSharing: true,
                    enableEmailInStats: false
                }}
                
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                }}

                onApiReady={(externalApi) => {
                    // here you can attach custom event listeners to the Jitsi Meet External API
                    // you can also store it locally to execute commands
                }}
                userInfo={{
                    displayName: 'YOUR_USERNAME',
                    email: "abc@gmail.com"
                }}
            />
        </div>

    )
}
export default JitsiMeetingComponent