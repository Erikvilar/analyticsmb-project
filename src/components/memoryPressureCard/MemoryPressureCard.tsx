import {
    GaugeContainer,
    GaugeReferenceArc,
    GaugeValueArc,
    useGaugeState,
} from "@mui/x-charts/Gauge";
import "./MemoryPressureCard.css";

const MEMORY_PRESSURE_VALUE = 13;
const MEMORY_PRESSURE_THRESHOLD = 80;
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

export function MemoryPressureCard() {
    const isCritical = MEMORY_PRESSURE_VALUE >= MEMORY_PRESSURE_THRESHOLD;

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
                        value={MEMORY_PRESSURE_VALUE}
                        sx={{
                            "& .MuiGauge-referenceArc": {
                                fill: "gray",
                            },
                            "& .MuiGauge-valueArc": {
                                fill: isCritical ? "#ffffff" : "#ffffff",
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
                        {MEMORY_PRESSURE_VALUE}
                        <span className="memory-pressure-card__unit">%</span>
                    </div>
                </div>

                <div className="memory-pressure-card__status">
          <span
              className={`memory-pressure-card__dot ${
                  isCritical ? "memory-pressure-card__dot--critical" : ""
              }`}
          />
                    <span className="memory-pressure-card__threshold">
            Threshold &gt; {MEMORY_PRESSURE_THRESHOLD}%
          </span>
                </div>
            </div>
        </div>
    );
}

export default MemoryPressureCard;