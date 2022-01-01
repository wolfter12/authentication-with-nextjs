import { useState, useEffect } from "react";
import { signIn } from "next-auth/client";

import classes from "./auth-form.module.css";

// TODO: migrate next-auth v3 to v4

async function createUser(email, password) {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response?.ok) {
    throw new Error(data.message || "Something went wrong!");
  }

  return data;
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [authFormValues, setAuthFormValues] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setAuthFormValues({
      email: "",
      password: "",
    });
  }, [isLogin]);

  const { email, password } = authFormValues;
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPassword = password.trim();

  const onChangeHandler = ({ target: { name, value } }) => {
    setAuthFormValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    // TODO: add email and password validation

    if (isLogin) {
      const result = await signIn("credentials", {
        redirect: false,
        email: normalizedEmail,
        password: normalizedPassword,
      });

      if (!result?.error) {
        // set some auth state
      }
    } else {
      try {
        const result = await createUser(normalizedEmail, normalizedPassword);
        setAuthFormValues({
          email: "",
          password: "",
        });
        console.log(result);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={onChangeHandler}
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onChangeHandler}
            required
          />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? "Login" : "Create Account"}</button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? "Create new account" : "Login with existing account"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
