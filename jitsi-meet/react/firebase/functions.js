import { database } from "./config"
import { onValue, ref, set, push, off, update, get, serverTimestamp, orderByChild, limitToLast, query } from "firebase/database"





export const getRoomFB = async (roomName) => {
    const roomRef = ref(database, "max_participant/" + roomName);
    const data = await get(roomRef)
    return data.val() ||{current_paticipants:0,max_participants:2}

};
export const updateRoomFB = async (roomName,numberParticipants) => {
    const roomRef = ref(database, "max_participant/" + roomName);
    const data = await update(roomRef,
        {
            current_paticipants:numberParticipants
        })
   

};
export const createRoomFB = async (roomName,maxParticipants) => {
    const roomRef = ref(database, "max_participant/" + roomName);
    const data = await set(roomRef,
        {
            current_paticipants:1,
            max_participants:maxParticipants
        })
   

};
export const getEndTimeFB = async (roomName) => {
    const timeRef = ref(database, "conference_duration/" + roomName);
    const data = await get(timeRef)
    return data.val() ||{end_time:0}

};
export const createEndTimeFB = async (roomName,endTimestamp) => {
    const roomRef = ref(database, "conference_duration/" + roomName);
    const data = await set(roomRef,
        {
            end_time:endTimestamp,
            
        })
   

};
export const updateEndTimeFB = async (roomName,endTimestamp) => {
    const roomRef = ref(database, "conference_duration/" + roomName);
    const data = await update(roomRef,
        {
            end_time:endTimestamp,
            
        })
   

};