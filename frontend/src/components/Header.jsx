import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, Menu, X } from "lucide-react";
function Header() {
  const links = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];
  const collections = [
    { name: "Mens Collection" },
    { name: "Women Collection" },
    { name: "Kids Collection" },
  ];
  const [isDropDown, setIsDropDown] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  return (
    <header className="w-full h-16 px-6 py-5 bg-blue-400 text-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            <Menu size={18} />
          </button>
        </div>
        <div>
          <h2 className="text-lg tracking-wide md:text-2xl font-bold hover:text-black duration-300 cursor-default">
            EZ WEAR
          </h2>
        </div>
        <nav className="hidden md:flex md:items-center md:gap-2">
          {links.map((item, index) => {
            return (
              <Link
                className="px-3 text-lg font-semibold hover:text-black hover:bg-white duration-300 rounded-md"
                key={index}
                to={item.link}
              >
                {item.name}
              </Link>
            );
          })}
          <div
            onMouseEnter={() => setIsDropDown(true)}
            onMouseLeave={() => setIsDropDown(false)}
            className="relative flex items-center px-3 text-lg font-semibold hover:text-black hover:bg-white duration-300 rounded-md cursor-pointer"
          >
            <Link className="pr-5">Collections</Link>
            <ArrowDown
              className="absolute right-2 top-1/2 -translate-y-1/2"
              size={18}
            />
            {isDropDown && (
              <div className="w-56 absolute left-0 top-full mt-2 bg-blue-400 text-white rounded-md overflow-hidden">
                {collections.map((item, index) => {
                  return (
                    <Link
                      className="block px-2 hover:bg-black duration-300"
                      key={index}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
        <div className="flex items-center gap-2 md:gap-5">
          <Link className="px-2 md:px-3 text-md md:text-lg font-semibold border border-transparent text-black bg-white hover:border-white hover:text-white hover:bg-blue-400 duration-300  rounded-md">
            Sign Up
          </Link>
          <Link className="px-2 md:px-3 text-md md:text-lg  text-white hover:text-black hover:bg-white duration-300 rounded-md">
            Sign In
          </Link>
        </div>
      </div>
      {isOpen && (
        <>
          <div className={`w-full min-h-screen backdrop-blur-lg transition-opacity ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
            <div className={`md:hidden fixed top-0 left-0 w-1/2 min-h-screen bg-blue-400 text-white duration-300 transform transition-transform ${isOpen ? "translate-x-0":"-x-tarnslate-full"} duration-300`}>
              <div>
                <button onClick={() => setIsOpen(false)}>
                  <X />
                </button>
              </div>
              <nav className="flex flex-col justify-start items-start gap-5">
                {links.map((item, index) => {
                  return (
                    <Link
                      className="w-full px-3 text-lg font-semibold hover:text-black hover:bg-white duration-300"
                      key={index}
                      to={item.link}
                    >
                      {item.name}
                    </Link>
                  );
                })}
                <div
                  onClick={() => setIsDropDown(!isDropDown)}
                  className="relative w-full max-w-md flex items-center px-3 text-lg font-semibold hover:text-black hover:bg-white duration-300 rounded-md cursor-pointer"
                >
                  <Link className="pr-5">Collections</Link>
                  <ArrowDown
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    size={18}
                  />
                  {isDropDown && (
                    <div className="w-full absolute left-0 top-10 bg-blue-400 text-white rounded-md">
                      {collections.map((item, index) => {
                        return (
                          <Link
                            className="w-full px-2 flex flex-col items-start gap-2 hover:bg-black duration-300"
                            key={index}
                          >
                            {item.name}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

export default Header;
