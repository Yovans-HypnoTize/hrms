import { createContext, useContext, useReducer } from 'react';

const initialState = {
    collapseMenu: false,
    currentPage: '',
    showPreloader: false,
    processingRequests: 0,
};

const AppStateContext = createContext(initialState);

export const StateActionTypes = {
    SET_MENU_COLLAPSE: "SET_MENU_COLLAPSE",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    SET_SHOW_PRELOADER: "SET_SHOW_PRELOADER",
    ADD_PROCESSING_REQUESTS: "ADD_PROCESSING_REQUESTS",
    REDUCE_PROCESSING_REQUESTS: "REDUCE_PROCESSING_REQUESTS",
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case StateActionTypes.SET_MENU_COLLAPSE:
            return {
                ...state, collapseMenu: action.collapseMenu
            }
        case StateActionTypes.SET_CURRENT_PAGE:
            return {
                ...state, currentPage: action.currentPage
            }
        case StateActionTypes.SET_SHOW_PRELOADER:
            return {
                ...state, showPreloader: action.showPreloader
            }
        case StateActionTypes.ADD_PROCESSING_REQUESTS:
            return {
                ...state, processingRequests: state.processingRequests + 1
            }
        case StateActionTypes.REDUCE_PROCESSING_REQUESTS:
            return {
                ...state, processingRequests: state.processingRequests - 1
            }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export const AppStateProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}

export const useAppState = () => useContext(AppStateContext);