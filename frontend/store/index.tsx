import { createStore } from "redux";

import rootReducer from "./reducers/root";

import { initialData as initialDataAction } from "./actions";

const store = createStore(rootReducer);

const initialPayload = (window as any).InitialPayload as any;
if (initialPayload) {
    store.dispatch(initialDataAction(initialPayload));
}

/* When running in development, log any changes to the state to make development easier. */
if (process.env.NODE_ENV === "development") {
    store.subscribe(() => {
        console.log("new state:", store.getState());
    });
}

export default store;
