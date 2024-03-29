const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlashUserinput = require("../util/session-flash-userinput");

function getSignup(req, res, next) {

  let sessionData = sessionFlashUserinput.getSessionData(req);

  if(!sessionData) {
    sessionData = {
      email: '',
      confirmEmail: '',
      password: '',
      fullname: '',
      street: '',
      postal: '',
      city: ''
    };
  }

  res.render("client/auth/signup", { inputData: sessionData });
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    confirmEmail: req.body['confirm-email'],
    password: req.body.password,
    fullname: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city,
  };

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body["confirm-email"])
  ) {
    sessionFlashUserinput.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input.Password must be atleast 5 characters long, postal must be 5 characters long",
        ...enteredData,
      },
      function () {
        res.redirect("/signup");
      }
    );
    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existsUserEmail = await user.existsUserEmail();

    if (existsUserEmail) {
      sessionFlashUserinput.flashDataToSession(
        req,
        {
          errorMessage: "User exists already!",
          ...enteredData,
        },
        function () {
          res.redirect("/signup");
        }
      );

      return;
    }
    await user.signup();
  } catch (error) {
    next(error);
    return;
  }

  res.redirect("/login");
}

function getLogin(req, res, next) {

  let sessionData = sessionFlashUserinput.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: '',
      password: ''
    }
  }

  res.render("client/auth/login", { inputData: sessionData });
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorLoginInputData = {
    errorMessage: "Please double-check your email and password!",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlashUserinput.flashDataToSession(req, sessionErrorLoginInputData,
      function () {
        res.redirect("/login");
      }
    );

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPasswords(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlashUserinput.flashDataToSession(req, sessionErrorLoginInputData,
      function () {
        res.redirect("/login");
      }
    );

    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect("/");
  });
}

function logout(req, res) {
  authUtil.destroyAuthenticationSessionPart(req);
  res.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
