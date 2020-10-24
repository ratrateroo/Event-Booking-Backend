import React, { Component } from 'react';

import './Auth.css';

class AuthPage extends Component {
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  submitHander = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    console.log(email, password);

    const requestBody = {
      query: `
            mutation {
                createUser(userInput: {email: "${email}", password:"${password}"}) {
                    _id
                    email
                }
            }
        `,
    };

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHander}>
        <div className="form-control">
          <label htmlFor="email">E-Mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>

        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>

        <div className="form-actions">
          <button type="submit">Submit</button>
          <button type="button">Swith to Signup</button>
        </div>
      </form>
    );
  }
}

export default AuthPage;
