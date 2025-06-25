import { useAppState, StateActionTypes } from "./AppState";

export const useAppStateAPI = () => {
    const { state, dispatch } = useAppState();

    return {
        collapseMenu: state.collapseMenu,
        setCollapseMenu: (collapseMenu: boolean) => dispatch({ type: StateActionTypes.SET_MENU_COLLAPSE, collapseMenu: collapseMenu }),

        currentPage: state.currentPage,
        setCurrentPage: (currentPage: string) => dispatch({ type: StateActionTypes.SET_CURRENT_PAGE, currentPage: currentPage }),

        processingRequests: state.processingRequests,
        addProcessingRequests: () => dispatch({ type: StateActionTypes.ADD_PROCESSING_REQUESTS }),
        reduceProcessingRequests: () => dispatch({ type: StateActionTypes.REDUCE_PROCESSING_REQUESTS })
    }
}