import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { UnAuthRoute, AuthRoute } from './routes';
import { Loading } from './common';
import { EventEmitter } from 'events';
import { USER_DATA, AUTH_CHANGE } from '../storage/Constant';
import { Storage } from '../storage/Storage';

export default class Root extends PureComponent {
    static propTypes = {

    }

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isLoggedIn: Storage.getUser(USER_DATA) ? true : false
        }

        this.eventEmitter = new EventEmitter();
    }

    componentDidMount = () => {
        setTimeout(() => {
            this.setState({ isLoading: false });
        }, 300);

        this.eventEmitter.on(AUTH_CHANGE, ({ isLoggedIn }) => {
            this.setState({ isLoggedIn });
        })
    }

    componentWillUnmount = () => {
        this.eventEmitter.removeListener(AUTH_CHANGE, () => {

        })
    }

    render() {
        const { isLoading, isLoggedIn } = this.state;

        if (isLoading) {
            return <Loading />;
        }

        if (isLoggedIn) {
            return (
                <div>
                    <AuthRoute eventEmitter={this.eventEmitter} />
                </div>
            );
        }

        return (
            <div>
                <UnAuthRoute eventEmitter={this.eventEmitter} />
            </div>
        )
    }
}
