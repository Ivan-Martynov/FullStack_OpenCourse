import axios from "axios";

const _getResponseData = (request) => request.then((response) => response.data);

const api_key = import.meta.env.VITE_SOME_KEY;

const current = async ({ city }) =>
    _getResponseData(
        axios.get(
            `http://api.weatherapi.com/v1/current.json` +
                `?key=${api_key}&q=${city}&aqi=no`
        )
    );

export default {
    current,
};
