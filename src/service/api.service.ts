
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
    getProcessesInfo:`${url}processesinfo`,
    postPrompt: `${url}prompt`,

}

const getPackage = () => {
   const packageName =  localStorage.getItem("process")
    return JSON.parse(packageName)
}

const apiService ={

    async getMemoryInfo(){
        try {

            const response = await axios.get(endpoints.getMemoryInfo+"?package="+getPackage());
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

            const response = await axios.get(endpoints.getGfxinfo+"?package="+getPackage())
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

            const response = await axios.get(endpoints.getBatteryinfo+"?package="+getPackage())
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

            const response = await axios.get(endpoints.getCpuInfo+"?package="+getPackage())
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

            const response = await axios.get(endpoints.getPidInfo+"?package="+getPackage())
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

            const response = await axios.get(endpoints.getNetworkInfo+"?package="+getPackage())
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

            const response = await axios.get(endpoints.getAppInfo+"?package="+getPackage())
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

            const response = await axios.get(endpoints.getQualityInfo+"?package="+getPackage())
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

    async getProcessesInfo(){
        try {

            const response = await axios.get(endpoints.getProcessesInfo)

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

    async postInputPrompt(prompt:string){
        try {

            const response = await axios.post(endpoints.postPrompt, {prompt:prompt, packageName:getPackage()})
            console.log(response)
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