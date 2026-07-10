import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import LinearProgress from "@mui/material/LinearProgress";
import Skeleton from "../skeleton/Skeleton";
import "./QualityCard.css";
import useQualityData from "../../hooks/useQualityData.ts";

export default function QualityCard() {
    const {
        score, label, breakdown,
        fps, jankyPercent,
        appPssMB,
        isLoading,
        isError
    } = useQualityData();

    if (isLoading) {
        return <Skeleton className="quality-chart-card" variant="gauge" />;
    }

    return (
        <div className="quality-chart-card">
            <div className="quality-chart-card__header">
                <span className="quality-chart-card__title">App quality</span>
                <span className="material-symbols-outlined quality-chart-card__info">info</span>
            </div>

            <div className="quality-chart-card__gauge-wrap">
                <Gauge
                    width={200}
                    height={140}
                    value={score}
                    valueMin={0}
                    valueMax={10}
                    startAngle={-110}
                    endAngle={110}
                    cornerRadius="50%"
                    text={() => ""}
                    sx={{
                        [`& .${gaugeClasses.valueArc}`]: {
                            fill: "#ffffff",
                        },
                        [`& .${gaugeClasses.referenceArc}`]: {
                            fill: "gray",
                        },
                    }}
                />
                <div className="quality-chart-card__value">
                    {score}<span className="quality-chart-card__unit"> /10</span>
                </div>
                <div className="quality-chart-card__description">{isError ? "App indisponível":label}</div>
            </div>

            <div className="quality-chart-card__breakdown">
                <div className="quality-chart-card__bar-row">
                    <div className="quality-chart-card__bar-label">
                        <span>FPS score</span>
                        <span>{breakdown.fpsScore}</span>
                    </div>
                    <LinearProgress
                        variant="determinate"
                        value={(breakdown.fpsScore / 10) * 100}
                        className="quality-chart-card__progress"
                    />
                    <div className="quality-chart-card__bar-meta">{fps} fps · {jankyPercent}% janky</div>
                </div>

                <div className="quality-chart-card__bar-row">
                    <div className="quality-chart-card__bar-label">
                        <span>Heap score</span>
                        <span>{breakdown.heapScore}</span>
                    </div>
                    <LinearProgress
                        variant="determinate"
                        value={(breakdown.heapScore / 10) * 100}
                        className="quality-chart-card__progress"
                    />
                    <div className="quality-chart-card__bar-meta">{appPssMB} MB</div>
                </div>
            </div>
        </div>
    );
}