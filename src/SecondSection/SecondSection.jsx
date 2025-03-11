import "../Styles/Home.css";
import studyingImage from "../assets/media/studying.jpg";
import SystemDesignImage from "../assets/media/SystemDesign.jpg";
import womenInPhone from "../assets/media/womenInPhone.jpg";

export default function SecondSection() {

  return (

    <div className="features-container">
      <h1 className="features-title">Idea</h1>
      <ul className="accordion">
        <li className="accordion--item">
          <div className="feature">
            <img src={SystemDesignImage} alt="" />
            <h1 className="feature-title">System Design</h1>
            <p className="feature-explain">Створити систему<br/>логіну/реєстрації<br/>та зберігати інформацію в базі данних.</p>
          </div>
        </li>
        <li className="accordion--item">
          <div className="feature">
            <img src={womenInPhone} alt="" />
            <h1 className="feature-title">Real Time</h1>
            <p className="feature-explain">Ідея створити чат,<br/>який повинен працювати<br/>в режимі<br/><span className="main-span-color">Реального Часу!</span></p>
          </div>
        </li>
        <li className="accordion--item">
          <div className="feature">
            <img src={studyingImage} alt="" />
            <h1 className="feature-title">Study</h1>
            <p className="feature-explain">Звичайно, основна<br/>ідея це<br/><span className="main-span-color">Навчитися.</span></p>
          </div>
        </li>
      </ul>
    </div>

  );
}