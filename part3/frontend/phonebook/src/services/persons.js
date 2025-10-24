import axios from "axios";

const baseUrl = "/api/persons";

const _getResponseData = (request) => request.then((response) => response.data);

const getAll = async () => _getResponseData(axios.get(baseUrl));

const create = async (newObject) =>
    _getResponseData(axios.post(baseUrl, newObject));

const update = async (id, newObject) =>
    _getResponseData(axios.put(`${baseUrl}/${id}`, newObject));

const remove = async (id) => _getResponseData(axios.delete(`${baseUrl}/${id}`));

export default {
    getAll,
    create,
    update,
    remove,
};
