import * as React from "react";
// MD5 hashing algorithm
import md5 from "../helpers/md5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Cell, ALIGNMENT } from "baseui/layout-grid";
import { AppNavBar } from "baseui/app-nav-bar";
import { H1 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";

function Register() {
  var [email, setEmail] = React.useState("");
  var [password, setPassword] = React.useState("");
  var [confirmPassword, setConfirmPassword] = React.useState("");
  var [errorMessage, setErrorMessage] = React.useState(false);
  var apiEndpointCheckpoint = process.env.REACT_APP_API_ENDPOINT_CHECKPOINT;
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // check if password and confirm password is the same
    if (password !== confirmPassword) {
      setErrorMessage("Password do not match");

      // adding setTimeout
      // setTimeout is asynchronous
      setTimeout(function () {
        return setErrorMessage(false);
      }, 10000);

      // terminate
      return;
    }

    // password length must be 6 characters
    if (password.length <= 5) {
      setErrorMessage("Password must be 6 or more characters");

      // adding setTimeout
      // setTimeout is asynchronous
      setTimeout(function () {
        return setErrorMessage(false);
      }, 10000);

      // terminate
      return;
    }

    // ==========================
    // Communicate to the backend
    // ==========================
    var data = {
      email: email,
      password: md5(password),
    };
    var send = await axios.post(
      `http://localhost:5000/register/${apiEndpointCheckpoint}`,
      data
    );

    // user was successfully registered
    if (send["data"] === "User registered") {
      // one-way storing technique
      localStorage.setItem("accountRegisteredHelper", true);

      navigate("/login");
    }
  }

  function handleClickSignIn() {
    navigate("/login");
  }

  return (
    <>
      <AppNavBar title="BENSTORE" />

      {/* Notification */}
      <Grid
        overrides={{
          Grid: {
            style: {
              display: "flex",
              justifyContent: "center",
            },
          },
        }}
      >
        <Cell span={6}>
          {errorMessage !== false && (
            <Notification
              overrides={{
                Body: { style: { width: "auto" } },
              }}
              closeable
              autoHideDuration={10000}
            >
              {errorMessage}
            </Notification>
          )}
        </Cell>
      </Grid>
      {/* End of notification */}

      <Grid
        overrides={{
          Grid: {
            style: {
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            },
          },
        }}
      >
        <Cell span={6}>
          <H1>Create account</H1>
          <form onSubmit={handleSubmit}>
            <FormControl label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
            </FormControl>

            <FormControl label="Password">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </FormControl>
            <FormControl label="Confirm Password">
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.currentTarget.value)}
              />
            </FormControl>
            <Button
              overrides={{
                BaseButton: {
                  style: {
                    width: "100%",
                    marginBottom: "5px",
                  },
                },
              }}
              type="submit"
            >
              CREATE ACCOUNT
            </Button>

            <Button
              overrides={{
                BaseButton: {
                  style: {
                    width: "100%",
                  },
                },
              }}
              kind={KIND.secondary}
              onClick={handleClickSignIn}
            >
              SIGN IN
            </Button>
          </form>
        </Cell>
      </Grid>
      <br />
      <br />
      <br />
    </>
  );
}

export default Register;
