import hero from "../assets/hero.png";
function Hero() {
  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div className="flex flex-col gap-8">
          <div className="head-text flex flex-col items-start gap-3">
            <h2>Welcome to</h2>
            <h2>EZ-SHOP</h2>
            <h2>Shop Your Favourite Clothes</h2>
            <h2>NOW!!!</h2>
          </div>
          <div>
            <button className="btn-primary bg-btn sub-text px-6 py-3 text-text-color">Shop NOW</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
