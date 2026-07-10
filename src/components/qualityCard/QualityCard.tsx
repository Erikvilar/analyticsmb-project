import {Gauge, gaugeClasses} from "@mui/x-charts";

const settings = {
    width: 200,
    height: 200,
    value: 10,
    description:'boa'
};
import "./QualityCard.css";


export default function QualityCard() {
    return (


        <div className="quality-chart-card">
            <div className="quality-chart-card__header">
                <h2 className="quality-chart-card__title">Quality chart</h2>
                <span className="material-symbols-outlined quality-chart-card__info">
          info
        </span>
            </div>
        <div className="quality-chart-card__body">

            <div className="quality-chart-card__gauge-wrap">
        <Gauge
            {...settings}
            cornerRadius="50%"
            sx={() => ({
                [`& .${gaugeClasses.valueText}`]: {
                    fontSize: 40,
                },
                [`& .${gaugeClasses.valueArc}`]: {
                    fill: '#ffffff',
                },
                [`& .${gaugeClasses.referenceArc}`]: {
                    fill: 'gray',
                },
            })}
        />

                <div className="quality-chart-card__value">
                    {settings.value}
                    <span className="quality-chart-card__unit">%</span>
                </div>
                <div className="quality-chart-card__description">
                    {settings.description}

                </div>
            </div>

        </div>

        </div>
    );
}