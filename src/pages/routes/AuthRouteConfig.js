import React from 'react';
import { Home } from "../dashboard";

export const authRoutes = [
    {
        path: "/home",
        component: (props) => <Home {...props} />,
        exact: false
    }
];