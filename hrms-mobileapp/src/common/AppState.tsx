import React, { ReactNode, createContext, useContext, useReducer } from 'react';

interface GlobalState {
    collapseMenu: boolean;
    currentPage: string;
    processingRequests: number;
}

interface ProviderAction {
    type: string;
    collapseMenu?: boolean;
    currentPage?: string;
    processingRequests?: number;
}

const initialState: GlobalState = {
    collapseMenu: false,
    currentPage: '',
    processingRequests: 0,
};

const AppStateContext = createContext<{
    state: GlobalState;
    dispatch: React.Dispatch<ProviderAction>;
}>({
    state: initialState,
    dispatch: () => undefined,
});

export const StateActionTypes = {
    SET_MENU_COLLAPSE: "SET_MENU_COLLAPSE",
    SET_CURRENT_PAGE: "SET_CURRENT_PAGE",
    ADD_PROCESSING_REQUESTS: "ADD_PROCESSING_REQUESTS",
    REDUCE_PROCESSING_REQUESTS: "REDUCE_PROCESSING_REQUESTS",
}

const reducer = (state: GlobalState = initialState, action: ProviderAction): GlobalState => {
    switch (action.type) {
        case StateActionTypes.SET_MENU_COLLAPSE:
            return {
                ...state, collapseMenu: action.collapseMenu || false
            }
        case StateActionTypes.SET_CURRENT_PAGE:
            return {
                ...state, currentPage: action.currentPage || ''
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

type AppStateProviderProps = {
    children: ReactNode;
};

export const AppStateProvider = ({ children }: AppStateProviderProps): JSX.Element => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <AppStateContext.Provider value={{ state, dispatch }}>
            {children}
        </AppStateContext.Provider>
    )
}

export const useAppState = (): { state: GlobalState, dispatch: React.Dispatch<ProviderAction> } => useContext(AppStateContext);