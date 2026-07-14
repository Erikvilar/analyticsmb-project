import ApiService from "../service/api.service.ts";
import {useEffect, useState} from "react";

const useFilterBar = () => {
    const [processes, setProcesses] = useState<string[]>([]);


    async function init() {
        try {
            const {success,data} = await  ApiService.getProcessesInfo();
            if(success){
                console.log(data)
                setProcesses(data.values || []);
            }

        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        init();
    },[])


    return {
        processes
    };
};

export default useFilterBar;
