import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { unAuthRoutes } from './UnAuthRouteConfig'

export default class UnAuthRoute extends PureComponent {
    static propTypes = {

    }

    render() {
        return (
            <Switch>
                {
                    unAuthRoutes.map((ele, index) => {
                        const { component: Component } = ele;

                        if (!ele.path)
                            return (<Route
                                key={`un-auth-routes-${index}`}
                                component={ele.component}
                            />);

                        return (<Route
                            exact={ele.exact}
                            path={ele.path}
                            key={`un-auth-routes-${index}`}
                            render={(props) => <Component {...props} {...this.props} />}
                        />);
                    })
                }
            </Switch>
        )
    }
}
