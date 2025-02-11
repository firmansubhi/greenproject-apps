import axios from "axios";
import { getToken } from "./index";

export const API_URL = "https://tempdev2.roomie.id/";

const http = axios.create({
	baseURL: API_URL,
	headers: {
		"Content-Type": "application/json",
	},
	timeout: 10000,
});

http.interceptors.request.use(
	(config) => {
		const token = getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		if (config.data instanceof FormData) {
			delete config.headers["Content-Type"];
		} else {
			config.headers["Content-Type"] = "application/json";
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

http.interceptors.response.use(
	(response) => response,
	(error) => {
		//if (error.response.status === 401) {
		//localStorage.removeItem("token");
		//window.location.href = "/ho,e";
		//}
		return Promise.reject(error);
	}
);

export const GET = async (url: any, params = {}) => {
	try {
		const response = await http.get(url, { params });
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const POST = async (url: any, data = {}) => {
	try {
		const response = await http.post(url, data);

		return response.data;
	} catch (error) {
		throw error;
	}
};

export const PUT = async (url: any, data = {}) => {
	try {
		const response = await http.put(url, data);
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const DELETE = async (url: any, params = {}) => {
	try {
		const response = await http.delete(url, { params });
		return response.data;
	} catch (error) {
		throw error;
	}
};

export const PATCH = async (url: any, data = {}) => {
	try {
		const response = await http.patch(url, data);
		return response.data;
	} catch (error) {
		throw error;
	}
};
