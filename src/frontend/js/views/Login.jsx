import React from 'react';

import 'logo.png';


class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="form-wrapper">
                <form className="form-signin">
                    <img
                        className="mb-4"
                        src="/img/logo.png"
                        width={102}
                        height={122}
                    />
                    <h1 className="h1 mb-5 font-weight-normal">Motuz</h1>
                    <div className="form-group">
                        <label htmlFor="inputEmail" className="sr-only">Email address</label>
                        <input type="text" className="form-control" placeholder="Username" required autoFocus autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="inputPassword" className="sr-only">Password</label>
                        <input type="password" className="form-control" placeholder="Password" required autoComplete="off" />
                    </div>
                    <div className="form-group">
                        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                    </div>
                    <p className="mt-5 mb-3 text-muted">&copy; 2019 Fred Hutchinson Cancer Research Center</p>
                </form>
            </div>
        );
    }

    componentDidMount() {

    }
}

Login.defaultProps = {

}

import {connect} from 'react-redux';

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
