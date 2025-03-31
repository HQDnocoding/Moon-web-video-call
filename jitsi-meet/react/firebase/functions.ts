import { database } from "./config";
import { onValue, ref, set, push, off, update, get, serverTimestamp, orderByChild, limitToLast, query, DataSnapshot } from "firebase/database";

// Interface để định nghĩa cấu trúc dữ liệu của room
interface RoomData {
    current_paticipants: number;
    max_participants: number;
}

// Interface để định nghĩa cấu trúc dữ liệu của end time
interface EndTimeData {
    end_time: number;
}

export const getRoomFB = async (roomName: string): Promise<RoomData> => {
    const roomRef = ref(database, "max_participant/" + roomName);
    const data: DataSnapshot = await get(roomRef);
    return data.val() || { current_paticipants: 0, max_participants: 2 };
};

export const updateRoomFB = async (roomName: string, numberParticipants: number): Promise<void> => {
    const roomRef = ref(database, "max_participant/" + roomName);
    await update(roomRef, {
        current_paticipants: numberParticipants
    });
};

export const createRoomFB = async (roomName: string, maxParticipants: number): Promise<void> => {
    const roomRef = ref(database, "max_participant/" + roomName);
    await set(roomRef, {
        current_paticipants: 1,
        max_participants: maxParticipants
    });
};

export const getEndTimeFB = async (roomName: string): Promise<EndTimeData> => {
    const timeRef = ref(database, "conference_duration/" + roomName);
    const data: DataSnapshot = await get(timeRef);
    return data.val() || { end_time: 0 };
};

export const createEndTimeFB = async (roomName: string, endTimestamp: number): Promise<void> => {
    const roomRef = ref(database, "conference_duration/" + roomName);
    await set(roomRef, {
        end_time: endTimestamp
    });
};

export const updateEndTimeFB = async (roomName: string, endTimestamp: number): Promise<void> => {
    const roomRef = ref(database, "conference_duration/" + roomName);
    await update(roomRef, {
        end_time: endTimestamp
    });
};