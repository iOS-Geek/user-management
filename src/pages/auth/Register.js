import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Storage } from '../../storage/Storage';
import { ROOT_USER, SUCCESS, PRESENT, AUTH_CHANGE } from '../../storage/Constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Register extends PureComponent {
    static propTypes = {

    }

    constructor(props) {
        super(props);

        this.requestBody = {
            name: "",
            email: "",
            password: ""
        }

        this.state = {
            errors: [],
            isLoading: false
        }
    }

    /** On text change */
    onChangeText = (e) => {
        if (!e) return;

        this.requestBody[e.target.name] = e.target.value;
        this.setState({ errors: [] });
    }

    /** Open page */
    openPage = (page) => {
        const { history } = this.props;

        history.push(page);
    }

    submit = (e) => {
        e.preventDefault();
        const { isLoading } = this.state;
        const { eventEmitter } = this.props;

        if (isLoading) return;

        this.validate(Object.keys(this.requestBody), this.requestBody, (status, response) => {
            if (status) {
                //Reset errors
                this.setState({
                    errors: [],
                    isLoading: true
                });

                Storage.setUser(ROOT_USER, this.requestBody, (status, response) => {
                    switch (status) {
                        case SUCCESS:
                            eventEmitter.emit(AUTH_CHANGE, {
                                isLoggedIn: true
                            });
                            this.openPage("/home");
                            break;
                        case PRESENT:
                            toast("Present!, user already exists.");
                            break;
                    }
                    this.setState({ isLoading: false });
                })
            } else {
                this.setState({
                    errors: response
                });
            }
        });
    }

    errors = (key) => {
        const { errors } = this.state;

        const index = errors.findIndex((ele) => ele.fieldName === key);
        if (index === -1) return {};

        return errors[index];
    }

    validate_email = (email) => {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    validate = (keys, requestBody, cb) => {
        if (!keys || (keys && !keys.length)) return;

        let emptyKeys = [];
        keys.forEach((ele) => {

            switch (ele) {
                case 'email':
                    if (requestBody[ele] && !this.validate_email(requestBody[ele])) {
                        emptyKeys.push({
                            fieldName: ele,
                            message: "Email is not valid."
                        });
                    }
                    break;
            }

            if (!requestBody[ele]) {
                const index = emptyKeys && emptyKeys.length ? emptyKeys.findIndex(ele => ele.fieldName === ele) : -1;

                if (index === -1)
                    emptyKeys.push({
                        fieldName: ele,
                        message: "Required"
                    });
            }
        });

        cb && cb(emptyKeys.length ? false : true, emptyKeys);
    }

    _btnSubmitText = () => {
        const { isLoading } = this.state;

        return isLoading ? "Please wait..." : "Sign Up"
    }

    render() {
        return (
            <div className="hold-transition login-page h-100vh">
                <ToastContainer />
                <div className="login-box container-center m-0">
                    <div className="login-logo">
                        <a className="stm-cursor"><b>User</b>Management</a>
                    </div>
                    <div className="login-box-body">
                        <p className="login-box-msg">Sign up to start your session</p>

                        <form onSubmit={this.submit.bind(this)} method="post">
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="Name" name="name" onChange={this.onChangeText} />
                                <span className="fa fa-user form-control-feedback"></span>
                                <p className="stm-input-error">{this.errors('name').message}</p>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="text" className="form-control" placeholder="Email" name="email" onChange={this.onChangeText} />
                                <span className="glyphicon glyphicon-envelope form-control-feedback"></span>
                                <p className="stm-input-error">{this.errors('email').message}</p>
                            </div>
                            <div className="form-group has-feedback">
                                <input type="password" className="form-control" placeholder="Password" name="password" onChange={this.onChangeText} />
                                <span className="glyphicon glyphicon-lock form-control-feedback"></span>
                                <p className="stm-input-error">{this.errors('password').message}</p>
                            </div>
                            <div className="row">
                                <div className="col-xs-12">
                                    <button type="submit" className="btn btn-primary btn-block btn-flat">{this._btnSubmitText()}</button>
                                </div>
                            </div>

                            <p className="login-box-msg mt-1">I already have an account? <span className="stm-cursor" onClick={this.openPage.bind(this, '/')}>Sign In</span></p>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}
