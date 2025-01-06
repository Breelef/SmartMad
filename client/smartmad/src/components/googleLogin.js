import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export const GoogleLoginComponent = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async (response) => {
    try {
      // Send the authorization code to the backend for processing in the callback
      const googleResponse = await fetch(`/auth/google/login/callback?code=${response.credential}`, {
        method: "GET",
      });

      const googleData = await googleResponse.json();

      if (googleData.token) {
        localStorage.setItem("accessToken", googleData.token);
        localStorage.setItem("user", JSON.stringify(googleData.user));
        navigate("/udfyld-til-opskrift"); // Redirect after successful login
      } else {
        alert("Google login failed: " + googleData.message);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      alert("An error occurred during Google login.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleLogin}
      onError={() => console.log("Login Failed")}
    />
  );
};

export const GoogleSignupComponent = () => {
  const navigate = useNavigate();

  const handleGoogleSignup = async (response) => {
    try {
      // Send the authorization code to the backend for processing in the callback
      const googleResponse = await fetch(`/auth/google/signup/callback?code=${response.credential}`, {
        method: "GET",
      });

      const googleData = await googleResponse.json();

      if (googleData.message === "User created") {
        navigate("/login"); // Redirect to login after successful signup
      } else {
        alert("Google sign-up failed: " + googleData.message);
      }
    } catch (error) {
      console.error("Error during Google sign-up:", error);
      alert("An error occurred during Google sign-up.");
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSignup}
      onError={() => console.log("Sign Up Failed")}
    />
  );
};
