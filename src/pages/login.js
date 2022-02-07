import * as React from "react";
// MD5 hashing algorithm
import md5 from "../helpers/md5";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Cell } from "baseui/layout-grid";
import { AppNavBar } from "baseui/app-nav-bar";
import { H1 } from "baseui/typography";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { Button, KIND } from "baseui/button";
import { Notification } from "baseui/notification";

function Login() {
  var [users, setUsers] = React.useState([]);
  var [email, setEmail] = React.useState("");
  var [password, setPassword] = React.useState("");
  var [accountRegistered, setAccountRegistered] = React.useState(false);
  var apiEndpointCheckpoint = process.env.REACT_APP_API_ENDPOINT_CHECKPOINT;
  const navigate = useNavigate();

  function handleClickCreateAccount() {
    navigate("/register");
  }

  function handleSubmit(e) {
    e.preventDefault();
    for (var i = 0; i < users.length; i++) {
      if (users[i]["email"] === email) {
        if (users[i]["password"] === md5(password)) {
          navigate("/");
        } else {
          navigate("/login");
        }
      }
    }
  }

  React.useEffect(async function () {
    // one-way storing technique
    // account succesfully registered
    if (JSON.parse(localStorage.getItem("accountRegisteredHelper")) === true) {
      setAccountRegistered(true);
    } else {
      setAccountRegistered(false);
    }
    localStorage.setItem("accountRegisteredHelper", false);
    // end, account succesfully registered

    // communicate to backend and get all users
    var getUsers = await axios.get(
      `http://localhost:5000/register/${apiEndpointCheckpoint}`
    );
    setUsers(getUsers["data"]);
  }, []);

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
          {accountRegistered && (
            <Notification
              overrides={{
                Body: { style: { width: "auto" } },
              }}
              closeable
              autoHideDuration={10000}
            >
              {function () {
                return "Account successfully registered";
              }}
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
          <H1>Sign in</H1>
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
              SIGN IN
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
              onClick={handleClickCreateAccount}
            >
              CREATE ACCOUNT
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

export default Login;
