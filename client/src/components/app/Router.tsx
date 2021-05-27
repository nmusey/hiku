import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Pages } from "../../constants/Pages";

export const Router = (): JSX.Element => (
    <HashRouter>
        <Switch>
            {
                Object.values(Pages)
                    .map(page => (
                        <Route exact path={page.route} key={page.route}>
                            {
                                page.component
                            }
                        </Route>
                    )
                )
            }
        </Switch>
    </HashRouter>
);