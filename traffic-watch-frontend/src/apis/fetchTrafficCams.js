import axios from "axios";
export const fetchTrafficCamData = async (BASE_URL, date, time) => {
    return await axios.get(
        `${BASE_URL}?dateTime=${date.format(
            'YYYY-MM-DD'
        )}T${time.format('HH:mm:ss')}`
    );
};