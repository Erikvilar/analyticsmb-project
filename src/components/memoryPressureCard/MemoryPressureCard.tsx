import {
    GaugeContainer,
    GaugeReferenceArc,
    GaugeValueArc,
    useGaugeState,
} from "@mui/x-charts/Gauge";
import "./MemoryPressureCard.css";
import Skeleton from "../skeleton/Skeleton.tsx";
import useMemoryData from "../../hooks/useMemoryData.ts";




function GaugePointer() {
    const { valueAngle, outerRadius, cx, cy } = useGaugeState();

    if (valueAngle === null) {
        // No value to display
        return null;
    }

    const target = {
        x: cx + outerRadius * Math.sin(valueAngle),
        y: cy - outerRadius * Math.cos(valueAngle),
    };
    return (
        <g>
            <circle cx={cx} cy={cy} r={5} fill="white" />
            <path
                d={`M ${cx} ${cy} L ${target.x} ${target.y}`}
                stroke="white"
                strokeWidth={3}
            />
        </g>
    );
}





export function MemoryPressureCard({isLoading}:{isLoading:boolean}) {

const {data,
    memoryPressure,
    memoryPressureThreshold,
    isMemoryPressureCritical,
    totalRamDeviceGB,
    availRamDeviceGB,
    usedRamDeviceGB,

    // heap nativo (MB)
    heapSizeMB,
    heapAllocMB,
    heapFreeMB,
    heapUsagePercent,
} = useMemoryData();




    if(isLoading){
        return <Skeleton className={"memory-pressure-card"} variant="gauge" />
    }
    return (
        <div className="memory-pressure-card">
            <div className="memory-pressure-card__header">
                <h2 className="memory-pressure-card__title">Memory Pressure</h2>
                <span className="material-symbols-outlined memory-pressure-card__info">
          info
        </span>
            </div>

            <div className="memory-pressure-card__body">
                <div className="memory-pressure-card__gauge-wrap">
                    <GaugeContainer
                        width={200}
                        height={140}
                        startAngle={-110}
                        endAngle={110}
                        value={memoryPressure}
                        sx={{
                            "& .MuiGauge-referenceArc": {
                                fill: "gray",
                            },
                            "& .MuiGauge-valueArc": {
                                fill: isMemoryPressureCritical ? "red" : "#ffffff",
                            },
                            // O texto central padrão do MUI é substituído pelo
                            // valor customizado abaixo, para manter a tipografia
                            // do protótipo (headline-lg + % menor ao lado)
                            "& .MuiGauge-valueText": {
                                display: "none",
                            },
                        }}
                    >
                        <GaugeReferenceArc />
                        <GaugeValueArc />
                        <GaugePointer />

                    </GaugeContainer>

                    <div className="memory-pressure-card__value">
                        {memoryPressure}
                        <span className="memory-pressure-card__unit">%</span>
                    </div>
                </div>

                <div className="memory-pressure-card__status">
          <span
              className={`memory-pressure-card__dot ${
                  isMemoryPressureCritical ? "memory-pressure-card__dot--critical" : ""
              }`}
          />
                    <span className="memory-pressure-card__threshold">
            Limite &gt; {memoryPressureThreshold}%
          </span>


                </div>

            </div>
            <div className={"memory-pressure-card__bottom-info"}>
            <span className="memory-pressure-card__bottom-info__text"> Total ram:
            {totalRamDeviceGB} GB
          </span>
                <span className="memory-pressure-card__bottom-info__text">
                Heap:
                    {heapSizeMB} MB
          </span>
            <span className="memory-pressure-card__bottom-info__text">
                Heap livre:
            {heapFreeMB} MB
          </span>
            <span className="memory-pressure-card__bottom-info__text">
                Heap consumida:
                {heapAllocMB} MB
          </span>
            </div>
        </div>
    );
}

export default MemoryPressureCard;