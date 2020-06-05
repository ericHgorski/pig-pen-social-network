import React from "react";
import Registration from "./registration";
import { HashRouter, Route } from "react-router-dom";
import Login from "./Login";
import ResetPassword from "./Reset";

export default function Welcome() {
    return (
        <div>
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset/start" component={ResetPassword} />
                </div>
            </HashRouter>
        </div>
    );
}
