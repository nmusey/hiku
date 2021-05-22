import React from "react";
import { Router } from "./Router";
import "antd/lib/style/themes/default.less";
import "../../styles/app.less";

export const App = (): JSX.Element => (
    <div className="app">
        <Router />
    </div>
);