import useAuth from "./useAuth";
import Axios from "axios";
import { formatErrorResponse } from "../helpers/errorHelper";

export default function useRequest() {
  const { getToken } = useAuth();

  const token = getToken();

  const post = async (url, body) => {
    let headers = {
      "Content-Type": "application/json"
    };

    if (token) {
      headers = { ...headers, Authorization: "Bearer " + token };
    }

    let response = {};

    await Axios.post(url, body, {
      headers: headers
    })
      .then(res => {
        response = res.data;
      })
      .catch(error => {
        response = formatErrorResponse(error);
      });

    return response;
  };

  const get = async (url, params) => {
    let headers = {};

    if (token) {
      headers = { Authorization: "Bearer " + token };
    }

    let response = {};

    await Axios.get(url, {
      params: params,
      headers: headers
    })
      .then(res => {
        response = res.data;
      })
      .catch(error => {
        response = formatErrorResponse(error);
      });

    return response;
  };

  return { get, post };
}
