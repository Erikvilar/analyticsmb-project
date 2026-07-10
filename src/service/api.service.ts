
import axios from "axios";


let LOOPBACK = "localhost";
let PORT = '3333'
let CONTEXT_PATH = 'analytics'
// =================================
let url = `http://${LOOPBACK}:${PORT}/${CONTEXT_PATH}/`

const endpoints ={

    getMemoryInfo: `${url}meminfo`,
    getGfxinfo: `${url}gfxinfo`,
    getBatteryinfo: `${url}batteryinfo`,
    getAppInfo: `${url}appinfo`,
    getPidInfo: `${url}pidinfo`,
    getNetworkInfo: `${url}networkinfo`,
    getQualityInfo: `${url}qualityinfo`,
    getCpuInfo: `${url}cpuinfo`,
}


const apiService ={

    async getMemoryInfo(){
        try {

            const response = await axios.get(endpoints.getMemoryInfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    },

    async getGfxInfo(){
        try {

            const response = await axios.get(endpoints.getGfxinfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    },

    async getBatteryInfo(){
        try {

            const response = await axios.get(endpoints.getBatteryinfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    },

    async getCpuInfo(){
        try {

            const response = await axios.get(endpoints.getCpuInfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    },

    async getPid(){
        try {

            const response = await axios.get(endpoints.getPidInfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    },

    async getNetworkInfo(){
        try {

            const response = await axios.get(endpoints.getNetworkInfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    },

    async getAppInfo(){
        try {

            const response = await axios.get(endpoints.getAppInfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    },

    async getQualityInfo(){
        try {

            const response = await axios.get(endpoints.getQualityInfo)
            return {
                success: true,
                status: response.status,
                data: response.data,

            };

        } catch (error: any) {
            if (error.response) {
                return {
                    success: false,
                    status: error.response.status,
                    message: error.response.data?.message,
                    data: error.response.data || null,
                };
            }

            return {
                success: false,
                status: 0,
                message: error.message || "Erro de conexão com o servidor",
                data: null,
            };
        }
    }

}

export default apiService;