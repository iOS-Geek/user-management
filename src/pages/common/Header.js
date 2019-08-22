import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { USER_DATA, AUTH_CHANGE } from '../../storage/Constant';
import { Storage } from '../../storage/Storage';

export default class Header extends PureComponent {
    static propTypes = {

    }

    state = {
        userData: Storage.getUser(USER_DATA)
    }

    _getUserName = () => {
        const { userData } = this.state;

        return userData ? userData.name.toUpperCase() : "No name available.";
    }

    _getEmail = () => {
        const { userData } = this.state;

        return userData ? userData.email : "No email available.";
    }

    openPage = (page) => {
        const { history } = this.props;

        history.push(page);
    }

    logout = () => {
        const { eventEmitter } = this.props;

        eventEmitter.emit(AUTH_CHANGE, {
            isLoggedIn: false
        });
        Storage.clearUser(USER_DATA);
        this.openPage("/");
    }

    render() {
        return (
            <header className="main-header">
                <a className="stm-cursor" className="logo" onClick={this.openPage.bind(this, '/home')}>
                    <span className="logo-mini"><b>U</b>M</span>
                    <span className="logo-lg"><b>User</b>Management</span>
                </a>
                <nav className="navbar navbar-static-top">
                    <a href="#" className="sidebar-toggle" data-toggle="push-menu" role="button">
                        <span className="sr-only">Toggle navigation</span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </a>

                    <div className="navbar-custom-menu">
                        <ul className="nav navbar-nav">
                            <li className="dropdown user user-menu">
                                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                                    <span className="hidden-xs">{this._getUserName()}</span>
                                </a>
                                <ul className="dropdown-menu">
                                    <li className="user-header">
                                        <p>{this._getUserName()}
                                            <small>{this._getEmail()}</small>
                                        </p>
                                    </li>
                                    <li className="user-footer">
                                        <div className="pull-left">
                                            <a className="btn btn-default btn-flat stm-cursor" onClick={this.openPage.bind(this, '/home')}>Profile</a>
                                        </div>
                                        <div className="pull-right">
                                            <a className="btn btn-default btn-flat stm-cursor" onClick={this.logout.bind(this)}>Sign out</a>
                                        </div>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        )
    }
}
