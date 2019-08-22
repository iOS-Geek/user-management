import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Storage } from '../../storage/Storage';
import { USER_DATA } from '../../storage/Constant';

export default class Profile extends PureComponent {
    static propTypes = {
        screenType: PropTypes.string
    }

    state = {
        userData: Storage.getUser(USER_DATA)
    }

    openPage = (path) => {
        const { history } = this.props;

        history.push(path);
    }

    _getUserName = () => {
        const { userData } = this.state;

        return userData ? userData.name : "No name available.";
    }

    _getEmail = () => {
        const { userData } = this.state;

        return userData ? userData.email : "No email available.";
    }

    _getPassword = () => {
        const { userData } = this.state;

        return userData ? userData.password : "No password available.";
    }

    _getImage = () => {
        const { userData } = this.state;

        return userData && userData.name ? userData.name.slice(0,2).toUpperCase() : "NA";
    }

    render() {
        const { userData } = this.state;
        const id = userData && userData.id ? userData.id : '';
        
        return (
            <React.Fragment>
                <section className="content-header">
                    <h1>
                        User Profile
                            </h1>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-md-2"></div>
                        <div className="col-md-8">
                            <div className="box box-primary">
                                <div className="box-body box-profile">
                                    <div className="profile-user-img img-responsive img-circle stm-img-wrapper">
                                        <p class="container-center stm-img-p">{this._getImage()}</p>
                                    </div>

                                    <h3 className="profile-username text-center">{this._getUserName()}</h3>

                                    <ul className="list-group list-group-unbordered">
                                        <li className="list-group-item">
                                            <b>Name</b> <a className="pull-right">{this._getUserName()}</a>
                                        </li>
                                        <li className="list-group-item">
                                            <b>Email</b> <a className="pull-right">{this._getEmail()}</a>
                                        </li>
                                        <li className="list-group-item">
                                            <b>Password</b> <a className="pull-right">{this._getPassword()}</a>
                                        </li>
                                    </ul>

                                    <a className="btn btn-primary btn-block stm-cursor" onClick={this.openPage.bind(this, `/home/user/edit/${id}`)}><b>Edit Profile</b></a>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2"></div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}
