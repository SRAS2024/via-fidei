// server/controllers/authController.js
const authService = require("../services/authService");
const sendResetEmail = require("../middleware/sendResetEmail");

/**
 * Register a new user
 */
async function register(req, res) {
  try {
    const { email, password, displayName } = req.body;
    const { token, user } = await authService.register(email, password, displayName);

    res.json({
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error("Error in register:", err);
    res.status(400).json({ error: err.message || "Registration failed" });
  }
}

/**
 * Login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { token, user } = await authService.login(email, password);

    res.json({
      token,
      user: { id: user.id, email: user.email, displayName: user.displayName },
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(401).json({ error: err.message || "Invalid credentials" });
  }
}

/**
 * Logout
 */
function logout(req, res) {
  // Token is handled client-side, so we just return success
  res.json({ message: "Logged out successfully" });
}

/**
 * Forgot password
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const { resetToken, resetLink } = await authService.forgotPassword(email);

    // Send reset email
    await sendResetEmail(email, resetLink);

    res.json({ message: "Password reset email sent" });
  } catch (err) {
    console.error("Error in forgotPassword:", err);
    res.status(500).json({ error: err.message || "Failed to send reset email" });
  }
}

/**
 * Reset password
 */
async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(400).json({ error: err.message || "Invalid or expired token" });
  }
}

module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
};
