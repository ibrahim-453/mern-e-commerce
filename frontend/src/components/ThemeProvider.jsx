import { useSelector } from "react-redux";

function ThemeProvider({ children }) {
  const { theme } = useSelector((state) => state.theme);
  console.log("Current theme:", theme);
  console.log(
    "Full theme state:",
    useSelector((state) => state.theme)
  );
  return (
    <div className={theme}>
      <div className="bg-bg-light dark:bg-bg-dark">{children}</div>
    </div>
  );
}

export default ThemeProvider;
