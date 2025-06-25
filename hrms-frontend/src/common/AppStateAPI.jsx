import { useAppState, StateActionTypes } from "./AppState";

export const useAppStateAPI = () => {
    const { state, dispatch } = useAppState();

    return {
        collapseMenu: state.collapseMenu,
        setCollapseMenu: (collapseMenu) => dispatch({ type: StateActionTypes.SET_MENU_COLLAPSE, collapseMenu: collapseMenu }),

        currentPage: state.currentPage,
        setCurrentPage: (currentPage) => dispatch({ type: StateActionTypes.SET_CURRENT_PAGE, currentPage: currentPage }),

        showPreloader: state.showPreloader,
        setShowPreloader: (showPreloader) => dispatch({ type: StateActionTypes.SET_SHOW_PRELOADER, showPreloader: showPreloader }),

        processingRequests: state.processingRequests,
        addProcessingRequests: () => dispatch({ type: StateActionTypes.ADD_PROCESSING_REQUESTS }),
        reduceProcessingRequests: () => dispatch({ type: StateActionTypes.REDUCE_PROCESSING_REQUESTS })
    }
}