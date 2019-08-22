import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ADD_USER, EDIT_PROFILE, ROOT_USER, SUCCESS, AUTH_CHANGE, PRESENT, USER_DATA, SUB_USER } from '../../storage/Constant';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Storage } from '../../storage/Storage';

export default class EditProfile extends PureComponent {
    static propTypes = {
        screenType: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            email: "",
            password: "",
            errors: [],
            userData: Storage.getUser(USER_DATA),
            isLoading: false
        }

        this.requestBody = {
            name: "",
            email: "",
            password: ""
        }
    }

    _getPageHeader = () => {
        const { screenType } = this.props;

        switch (screenType) {
            case ADD_USER:
                return "Add User";
            case EDIT_PROFILE:
                return "Edit User";
        }
    }

    _getSubPageHeader = () => {
        const { screenType } = this.props;
        const { userData } = this.state;
        if(!userData) return;

        switch (screenType) {
            case ADD_USER:
                return userData.name;
            case EDIT_PROFILE:
                return userData.name;
        }
    }

    componentDidMount = () => {
        const { screenType, match: { params } } = this.props;
        switch (screenType) {
            case EDIT_PROFILE:
                Storage.getUserViaId(params.userId, (status, response) => {
                    console.log('res ===> ', response);
                    if (status === SUCCESS) {
                        this.requestBody = {
                            name: response.name,
                            email: response.email,
                            password: response.password
                        };

                        this.setState({
                            userData: response,
                            ...this.requestBody
                        });
                    }
                })
                break;
        }
    }

    /** On text change */
    onChangeText = (e) => {
        if (!e) return;

        this.requestBody[e.target.name] = e.target.value;
        this.setState({ [e.target.name]: e.target.value, errors: [] });
    }

    /** Open page */
    openPage = (page) => {
        const { history } = this.props;

        history.push(page);
    }

    submit = (e) => {
        e.preventDefault();
        const { screenType } = this.props;

        switch (screenType) {
            case ADD_USER:
                this.onAdd();
                break;
            case EDIT_PROFILE:
                this.onEdit();
                break;
        }
    }

    onEdit = () => {
        const { isLoading } = this.state;

        if (isLoading) return;

        this.validate(Object.keys(this.requestBody), this.requestBody, (status, response) => {
            if (status) {
                //Reset errors
                this.setState({
                    errors: [],
                    isLoading: true
                });

                Storage.editUser(this.requestBody, (status, response) => {
                    switch (status) {
                        case SUCCESS:
                            this.openPage("/home/user/list");
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

    onAdd = () => {
        const { isLoading, userData } = this.state;

        if (isLoading) return;

        if(!userData.id){
            toast("User id is not available!");
            return;
        }

        this.validate(Object.keys(this.requestBody), this.requestBody, (status, response) => {
            if (status) {
                //Reset errors
                this.setState({
                    errors: [],
                    isLoading: true
                });

                this.requestBody.rootUserId = userData.id;
                Storage.setUser(SUB_USER, this.requestBody, (status, response) => {
                    switch (status) {
                        case SUCCESS:
                            this.openPage("/home/user/list");
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
        const { name, email, password } = this.state;
        const { screenType } = this.props;

        return (
            <React.Fragment>
                <ToastContainer />
                <section className="content-header">
                    <h1>
                        {this._getPageHeader()}
                    </h1>
                </section>


                <section className="content">
                    <div className="row">
                        <div className="col-md-3"></div>
                        <div className="col-md-6">
                            <div className="box box-primary">
                                <div className="box-header with-border">
                                    <h3 className="box-title">Hi {this._getSubPageHeader()}!</h3>
                                </div>
                                <form onSubmit={this.submit.bind(this)} role="form">
                                    <div className="box-body">
                                        <div className="form-group">
                                            <label htmlFor="name">Name</label>
                                            <input type="text" className="form-control" id="name" name="name" placeholder="Enter name" value={name} onChange={this.onChangeText.bind(this)} />
                                            <p className="stm-input-error">{this.errors('name').message}</p>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Email address</label>
                                            <input type="text" className="form-control" id="email" name="email" placeholder="Enter email" value={email} onChange={this.onChangeText.bind(this)} disabled={screenType === EDIT_PROFILE ? true : false} />
                                            <p className="stm-input-error">{this.errors('email').message}</p>
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="password">Password</label>
                                            <input type="password" className="form-control" id="password" name="password" placeholder="Password" value={password} onChange={this.onChangeText.bind(this)} />
                                            <p className="stm-input-error">{this.errors('password').message}</p>
                                        </div>
                                    </div>
                                    <div className="box-footer">
                                        <button type="submit" className="btn btn-primary">Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-3"></div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}
