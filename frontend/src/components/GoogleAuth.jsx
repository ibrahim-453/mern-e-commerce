import googleLight from "../assets/googleLight.svg";
import googleDark from "../assets/googleDark.svg";
import { useSelector } from "react-redux";

function GoogleAuth() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/v1/auth/google";
  };
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className="w-full">
      <button
        className="w-full text-primary border-2 border-bg-btn dark:border-bg-light flex justify-center items-center gap-2 px-4 py-2 rounded-full hover:bg-bg-secondary hover:bg-opacity-10 dark:hover:bg-bg-secondary-dark dark:hover:bg-opacity-20 duration-300 text-sm sm:text-base sm:gap-3 sm:px-6"
        onClick={handleGoogleLogin}
        type="button"
      >
        <span className="font-medium">Continue with Google</span>
        <img
          src={theme === "light" ? googleLight : googleDark}
          width={20}
          height={20}
          alt="Google logo"
          className="w-5 h-5 sm:w-6 sm:h-6"
        />
      </button>
    </div>
  );
}

export default GoogleAuth;
