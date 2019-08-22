import React from 'react';
import { Login, Register } from "../auth";
import { NotFoundPage } from "../common";

export const unAuthRoutes = [
    {
        path: "/",
        component: Login,
        exact: true
    },
    {
        path: "/signup",
        component: Register,
        exact: true
    },
    {
        main: NotFoundPage
    }
];