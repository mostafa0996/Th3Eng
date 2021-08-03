const express = require("express");
const router = express.Router();
const passport = require("passport");

const isAuthorized = require("../../common/middleware/isAuthorized");
const validateRequest = require("../../common/middleware/validateRequest");
const {OAuth2Client}=require('google-auth-library')

const client=new OAuth2Client("26623638335-6m7jvf9g5ml879t1pc4q7g6tbtol2a12.apps.googleusercontent.com");
const {
  login,
  socialLogin,
  socialCallback,
  signUp,
  forgotPassword,
  resetPassword,
  verifyUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  exportUsers,
  sendHireDeveloperEmail,
  sendContactUsEmail,
} = require("./controller/index");

const {
  loginSchema,
  signUpSchema,
  userVerifySchema,
  userForgotPasswordSchema,
  userPasswordResetSchema,
  getAllUserSchema,
  getUserSchema,
  updateUserSchema,
  deleteUserSchema,
} = require("./joi/index");

const {
  USER_GET_ALL_USERS,
  USER_DELETE_USER,
  USER_GET_USER,
  USER_UPDATE_USER,
  USER_HIRE_DEVELOPER,
  USER_EXPORT_USERS,
} = require("./helpers/constants");
const { response } = require("express");

router.post("/login", validateRequest(loginSchema), login);

router.post("/signup", validateRequest(signUpSchema), signUp);

router.post("/auth/google", (req,res) => {
  const {tokenId}=req.body;
  // verify Token 
  client.verifyIdToken({idToken:tokenId,audience:"26623638335-6m7jvf9g5ml879t1pc4q7g6tbtol2a12.apps.googleusercontent.com"}).then(response=>{
    const {email_verfied,name,email}=response.payload;
    if(email_verfied){
      // do 
    }
  })
});

router.get(
  "/auth/google/callback",
  socialCallback("google", ["openid", "profile", "email"]),
  socialLogin
);

// Redirect the user to Facebook for authentication
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    session: false,
    scope: ["public_profile", "email"],
  })
);
// Facebook will redirect the user to this URL after approval.
// If access was granted, the user will be logged in. Otherwise authentication has failed.
router.get(
  "/auth/facebook/callback",
  socialCallback("facebook", ["public_profile", "email"]),
  socialLogin
);

router.put("/verify", validateRequest(userVerifySchema), verifyUser);

router.post(
  "/forgot-password",
  validateRequest(userForgotPasswordSchema),
  forgotPassword
);

router.post(
  "/reset-password/:token",
  validateRequest(userPasswordResetSchema),
  resetPassword
);

router.get(
  "/",
  isAuthorized(USER_GET_ALL_USERS),
  validateRequest(getAllUserSchema),
  getAllUsers
);

router.get("/export", isAuthorized(USER_EXPORT_USERS), exportUsers);

router.get(
  "/:id",
  isAuthorized(USER_GET_USER),
  validateRequest(getUserSchema),
  getUser
);

router.put(
  "/:id",
  isAuthorized(USER_UPDATE_USER),
  validateRequest(updateUserSchema),
  updateUser
);

router.delete(
  "/:id",
  isAuthorized(USER_DELETE_USER),
  validateRequest(deleteUserSchema),
  deleteUser
);

router.post("/hire", isAuthorized(USER_HIRE_DEVELOPER), sendHireDeveloperEmail);

router.post("/contact", sendContactUsEmail);

module.exports = router;
