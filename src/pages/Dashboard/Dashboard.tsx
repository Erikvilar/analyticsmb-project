import MemoryPressureCard from "../../components/memoryPressureCard/MemoryPressureCard.tsx";
import FilterBar from "../../components/filterBar/FilterBar.tsx";
import "./Dashboard.css"
import QualityCard from "../../components/qualityCard/QualityCard.tsx";
import {useLayoutContext} from "../../hooks/useLayoutContext.ts";
import CpuCard from "../../components/cpuCard/CpuCard.tsx";
export default function Dashboard  () {

    const { isLoading } = useLayoutContext();


    return (
        <div>
            <FilterBar/>

            <div className="row-chart">
                <MemoryPressureCard isLoading={isLoading}/>

                <QualityCard />
            </div>
            <CpuCard/>
        </div>
    )
}