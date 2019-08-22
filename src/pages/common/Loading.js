import React from 'react'
import PropTypes from 'prop-types'

function Loading(props) {
    return (
        <div className="hold-transition login-page h-100vh">
            <div className="login-box container-center m-0">
                <div className="login-logo">
                    <a className="stm-cursor">Loading...</a>
                </div>
            </div>
        </div>
    )
}

export default Loading

