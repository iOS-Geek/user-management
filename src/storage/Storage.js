import { ROOT_USER, PRESENT, SUCCESS, USER_DATA, NO_DATA } from "./Constant";

export class Storage {

    static setUser = (userType, requestBody, cb) => {
        const { email } = requestBody;

        let stored_data = this.getUser(ROOT_USER) ? this.getUser(ROOT_USER) : [];
        const uniqueKey = `${new Date().getTime()}${Math.random() * 10000000}`;

        if (stored_data) {

            const index = stored_data.findIndex(ele => ele.email.toUpperCase() === requestBody.email.toUpperCase());
            if (index === -1) {
                const data = Object.assign(requestBody, {
                    userType,
                    id: uniqueKey
                });

                stored_data.push(data);
                localStorage.setItem(ROOT_USER, JSON.stringify(stored_data));
                if (userType === ROOT_USER) {
                    localStorage.setItem(USER_DATA, JSON.stringify(data));
                }

                cb(SUCCESS, data);
                return;
            }

            cb(PRESENT, {});
        }
    }

    static editUser = (requestBody, cb) => {
        const { email } = requestBody;

        let stored_data = this.getUser(ROOT_USER) ? this.getUser(ROOT_USER) : [];

        if (stored_data) {

            const index = stored_data.findIndex(ele => ele.email.toUpperCase() === email.toUpperCase());
            if (index !== -1) {
                const { id, email, ...rest } = requestBody;
                const data = Object.assign(stored_data[index], {
                    ...rest
                });

                stored_data[index] = data;
                localStorage.setItem(ROOT_USER, JSON.stringify(stored_data));
                const user = this.getUser(USER_DATA);
                if (user.id === data.id) {
                    localStorage.setItem(USER_DATA, JSON.stringify(data));
                }

                cb(SUCCESS, data);
                return;
            }

            cb(NO_DATA, {});
        }
    }

    static getUser = (key) => {
        return JSON.parse(localStorage.getItem(key));
    }

    static deleteUser = (id, cb) => {

        let stored_data = this.getUser(ROOT_USER) ? this.getUser(ROOT_USER) : [];

        if (stored_data) {

            const index = stored_data.findIndex(ele => ele.id.toUpperCase() === id.toUpperCase());
            if (index !== -1) {
                stored_data.splice(index, 1);
                localStorage.setItem(ROOT_USER, JSON.stringify(stored_data));

                cb(SUCCESS, stored_data);
                return;
            }

            cb(NO_DATA, {});
        }
    }

    static getUserViaId = (id, cb) => {

        let stored_data = this.getUser(ROOT_USER) ? this.getUser(ROOT_USER) : [];

        if (stored_data) {

            const index = stored_data.findIndex(ele => ele.id.toUpperCase() === id.toUpperCase());
            if (index !== -1) {
                cb(SUCCESS, stored_data[index]);
                return;
            }

            cb(NO_DATA, {});
        }
    }

    static getUsersViaId = (id, cb) => {

        let stored_data = this.getUser(ROOT_USER) ? this.getUser(ROOT_USER) : [];

        if (stored_data) {

            const index = stored_data.findIndex(ele => ele.id.toUpperCase() === id.toUpperCase());
            if (index !== -1) {
                const user = stored_data[index];
                const data = Array.from(stored_data).filter(ele => ele.rootUserId === user.id);
                console.log("data ===> ", data, user);
                cb(SUCCESS, data);
                return;
            }

            cb(NO_DATA, {});
        }
    }

    static login = (requestBody, cb) => {
        const { email, password } = requestBody;

        let stored_data = this.getUser(ROOT_USER) ? this.getUser(ROOT_USER) : [];

        if (stored_data) {

            const index = stored_data.findIndex(ele => ele.email.toUpperCase() === email.toUpperCase() && ele.password === password);
            if (index !== -1) {
                localStorage.setItem(USER_DATA, JSON.stringify(stored_data[index]));
                cb(SUCCESS, stored_data[index]);
                return;
            }

            cb(NO_DATA, {});
        }
    }

    static clearUser = (key) => {
        return localStorage.removeItem(key);
    }
}