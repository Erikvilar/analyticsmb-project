import { useOutletContext } from "react-router-dom";

type LayoutContext = {
    isLoading: boolean;
};

export function useLayoutContext() {
    return useOutletContext<LayoutContext>();
}