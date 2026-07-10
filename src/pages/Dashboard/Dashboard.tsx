import MemoryPressureCard from "../../components/memoryPressureCard/MemoryPressureCard.tsx";
import FilterBar from "../../components/filterBar/FilterBar.tsx";
import "./Dashboard.css"
import QualityCard from "../../components/qualityCard/QualityCard.tsx";
export default function Dashboard  () {
    return (
        <div>
            <FilterBar/>
            <div className="row-chart">
                <MemoryPressureCard/>

                <QualityCard/>
            </div>

        </div>
    )
}