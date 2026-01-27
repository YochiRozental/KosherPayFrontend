import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "../features/auth/authSlice";
import requestsReducer from "../features/requests/paymentRequestsSlice";
import transactionsReducer from "../features/transactions/transactionsSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    transactions: transactionsReducer,
    requests: requestsReducer,
});

export default rootReducer;
