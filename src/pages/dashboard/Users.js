import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Storage } from '../../storage/Storage';
import { USER_DATA, ROOT_USER, SUCCESS } from '../../storage/Constant';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class Users extends PureComponent {
    static propTypes = {

    }

    state = {
        userData: Storage.getUser(USER_DATA),
        usersList: []
    }

    componentDidMount = () => {
        this.getUsers();
    }

    getUsers = () => {
        const { userData } = this.state;

        if (userData.id) {
            Storage.getUsersViaId(userData.id, (status, response) => {
                if (status === SUCCESS) {
                    this.setState({
                        usersList: response ? response : []
                    })
                }
            });
        }
    }

    openPage = (path) => {
        const { history } = this.props;

        history.push(path);
    }

    _getUserData = () => {
        const { userData } = this.state;

        return userData ? userData.name : "No name available";
    }

    _deleteUser = (id) => {
        Swal.fire({
            title: 'Would you realy want to delete this user.',
            showCancelButton: true,
            confirmButtonText: 'Delete',
            showLoaderOnConfirm: true,
        }).then((result) => {
            if (result.value) {
                Storage.deleteUser(id, (status, response) => {
                    if (status === SUCCESS) {
                        this.getUsers();

                        toast.success('Successfuly deleted!');
                        return;
                    }

                    toast.error('Please try again!');
                })
            }
        })
    }

    render() {
        const { usersList } = this.state;

        return (
            <React.Fragment>
                <ToastContainer />
                <section className="content-header">
                    <h1>
                        Users
                    </h1>
                </section>

                <section className="content">
                    <div className="row">
                        <div className="col-xs-12">
                            <div className="box">
                                <div className="box-header">
                                    <h3 className="box-title">{this._getUserData()} Users</h3>
                                </div>
                                <div className="box-body">
                                    <table id="example2" className="table table-bordered table-hover">
                                        <thead>
                                            <tr>
                                                <th>Sr No.</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Password</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                usersList && usersList.length ? usersList.reverse().map(({ name, email, password, id }, index) => (<tr key={`users-list-${index}`}>
                                                    <td>{id ? id.slice(id.length - 5, id.length) : 'No id available'}</td>
                                                    <td>{name}</td>
                                                    <td>{email}</td>
                                                    <td>{password}</td>
                                                    <td>
                                                        <div className="btn-group">
                                                            <button type="button" className="btn btn-default" onClick={this.openPage.bind(this, `/home/user/edit/${id}`)}><i className="fa fa-edit"></i></button>
                                                            <button type="button" className="btn btn-default" onClick={this._deleteUser.bind(this, id)}><i className="fa fa-trash"></i></button>
                                                        </div>
                                                    </td>
                                                </tr>))
                                                    : <tr>
                                                        <td></td>
                                                        <td></td>
                                                        <td>No Data Available</td>
                                                        <td></td>
                                                        <td></td>
                                                    </tr>
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </React.Fragment>
        )
    }
}
