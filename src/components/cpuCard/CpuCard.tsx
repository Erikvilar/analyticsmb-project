

import Skeleton from "../skeleton/Skeleton";
import useCpuData from "../../hooks/useCpuData.ts";

import "./CpuCard.css";
interface Metric {
    icon: string;
    label: string;
    value: string | number | undefined;
}
export default function CpuCard() {

    const {
        cpuPercent,
        userCpuPercent,
        kernelCpuPercent,
        pid,
        processName,
        faultsMinor,
        faultsMajor,
        isLoading,
        isError
    } = useCpuData();

    if (isLoading) {
        return <Skeleton className="cpu-card" variant="table" />;
    }

    if (isError) {
        return (
            <div className="cpu-card">
                Aplicação indisponível
            </div>
        );
    }
    const metrics: Metric[] = [
        {
            icon: "memory",
            label: "Total CPU",
            value: `${cpuPercent}%`
        },
        {
            icon: "neurology",
            label: "User CPU",
            value: `${userCpuPercent}%`
        },
        {
            icon: "settings",
            label: "Kernel CPU",
            value: `${kernelCpuPercent}%`
        },
        {
            icon: "badge",
            label: "PID",
            value: pid
        },
        {
            icon: "apps",
            label: "Process",
            value: processName
        },
        {
            icon: "description",
            label: "Minor Faults",
            value: faultsMinor
        },
        {
            icon: "warning",
            label: "Major Faults",
            value: faultsMajor
        }
    ];
    return (

        <div className="cpu-card">

            <div className="cpu-card__header">

        <span className="material-symbols-outlined">
            memory
        </span>

                <span>CPU Monitor</span>

            </div>

            <div className="cpu-card__content">

                {metrics.map(metric => (

                    <div className="cpu-card__metric" key={metric.label}>

                        <div className="cpu-card__metric-icon">

                    <span className="material-symbols-outlined">
                        {metric.icon}
                    </span>

                        </div>

                        <div>

                            <div className="cpu-card__metric-label">
                                {metric.label}
                            </div>

                            <div className="cpu-card__metric-value">
                                {metric.value ?? "--"}
                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

function Metric({
                    icon,
                    label,
                    value
                }:{
    icon:React.ReactNode;
    label:string;
    value:any;
}){

    return(

        <div className="cpu-card__metric">

            <div className="cpu-card__metric-icon">
                {icon}
            </div>

            <div>

                <div className="cpu-card__metric-label">
                    {label}
                </div>

                <div className="cpu-card__metric-value">
                    {value}
                </div>

            </div>

        </div>

    );

}