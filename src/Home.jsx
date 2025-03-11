import "./Styles/Home.css";
import video from "./assets/vid/3044313-Hd 1920 1080 24Fps.webm";
import SecondSection from "./SecondSection/SecondSection";
import { useState } from "react";
import { useNavigate } from "react-router-dom"

export default function Home() {

  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState(null);
  const [content, setContent] = useState(null);

  function selectItem(event) {
    const item = event.target;
    if (item.classList.contains('grid--item')) {
      if (selectedItem) {
        selectedItem.classList.remove('selected');
      }
      item.classList.add('selected');
      setSelectedItem(item);
    }
  }

  function select(event, elementClass) {
    const element = document.querySelector(`.${elementClass}`);
    if (content) {
      content.classList.remove('selected-content');
    }
    if (element) {
      element.classList.add('selected-content');
      selectItem(event);
      setContent(element);
    }
  }

  function scrollToSection(event, sectionId) {
    event.preventDefault();
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function HandleNavigateToSignIn() {
    navigate("/login");
  }

  return (
    <div className="home">
      <header className="home-header">
        <div className="header-container">
          <a href="" className="home-logo"><i className='bx bxs-chat'></i></a>
          <ul className="menu">
            <li className="menu-element" onClick={(event) => scrollToSection(event, '#home')}>Home</li>
            <li className="menu-element" onClick={(event) => scrollToSection(event, '#idea')}>Idea</li>
            <li className="menu-element" onClick={(event) => scrollToSection(event, "#tech")}>Tech</li>
            <li className="menu-element" onClick={(event) => scrollToSection(event, "#resources")}>Resources</li>
          </ul>
        </div>
        <button className="explore-button" onClick={HandleNavigateToSignIn}>
          <svg className="svgIcon" viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg>
          Explore
        </button>
      </header>
      <main>
        <section className="title-section" id="home">
          <video src={video} className="title-video" autoPlay muted loop></video>

          <article className="title-article">
            <i className='bx bxs-quote-left quote-left'></i>
            <h1><span className="communication-span">Communication</span><br/> is the lifeline of any <span className="relationship-span">relationship</span></h1>
            <i className='bx bxs-quote-right quote-right'></i>
          </article>

          <div className="author-div">
            <p className="author-content">Курсова робота <span className="author-span">Кравця Арсенія</span>.<br/>Керівник: <span className="author-span">Шаповал Володимир</span>.</p>
          </div>
        </section>
        <section className="second-section" id="idea">
          <div className="slider">
            <div className="list">
              <h1 className="item one">Simple <span>Chat App</span></h1>
              <h1 className="item tho">Simple <span>Chat App</span></h1>
              <h1 className="item tree">Simple <span>Chat App</span></h1>
              <h1 className="item four">Simple <span>Chat App</span></h1>
              <h1 className="item five">Simple <span>Chat App</span></h1>
            </div>
          </div>
          <SecondSection></SecondSection>
        </section>
        <section className="third-section" id="tech">
          <div className="third-section-container">
            <h1 className="section-title">Tech Stack</h1>
            <div className="grid-container">
              <div className="grid--item" style={{ gridArea: "box-1" }} onClick={(event) => select(event, "html")}>
                <i className='bx bxl-html5'></i>
              </div>
              <div className="grid--item transparent" style={{gridArea: "box-2"}}></div>
              <div className="grid--item" style={{ gridArea: "box-3" }} onClick={(event) => select(event, "js")}>
                <i className='bx bxl-javascript' ></i>
              </div>
              <div className="grid--item" style={{ gridArea: "box-4" }} onClick={(event) => select(event, "react")}>
                <i className='bx bxl-react'></i>
              </div>
              <div className="grid--item" style={{ gridArea: "box-5" }} onClick={(event) => select(event, "firebase")}>
                <i className='bx bxl-firebase' ></i>
              </div>
              <div className="grid--item" style={{ gridArea: "box-6" }} onClick={(event) => select(event, "css")}>
                <i className='bx bxl-css3' ></i>
              </div>
              <div className="grid--item transparent" style={{gridArea: "box-7" }}></div>
              <div className="grid--item transparent" style={{gridArea: "box-8"}}></div>
              </div>
          </div>
          <div className="screen">
            <div className="content-item html">
              <h1 className="tech-title">HTML</h1>
              <p className="tech-explain"><span className="underline-span">HTML</span> — стандартизована мова <span className="underline-span">розмітки</span> документів для перегляду вебсторінок у браузері. Браузери отримують HTML документ від сервера за протоколами <span className="underline-span">HTTP/HTTPS</span> або відкривають з локального диска, далі інтерпретують код в інтерфейс, який відображатиметься на екрані монітора.</p>
            </div>
            <div className="content-item css">
              <h1 className="tech-title">CSS</h1>
              <p className="tech-explain"><span className="underline-span">CSS</span> — це спеціальна мова стилю сторінок, що використовується для опису їхнього <span className="underline-span">зовнішнього</span> <span className="underline-span">вигляду.</span> Самі ж сторінки написані мовами розмітки даних. CSS є основною технологією всесвітньої павутини, поряд із HTML та JavaScript.</p>
            </div>
            <div className="content-item js">
              <h1 className="tech-title">JavaScript</h1>
              <p className="tech-explain"><span>JavaScript</span> — динамічна, об'єктно-орієнтована прототипна мова програмування. Використав для <span className="underline-span">динамічності</span> та для <span className="underline-span">функціональності</span>  сайту.</p>
            </div>
            <div className="content-item firebase">
              <h1 className="tech-title">Firebase</h1>
              <p className="tech-explain"><span className="underline-span">Firebase</span> — це платформи розробки мобільних та веб застосунків. Firebase розвивається з 2011 року компанією Firebase Inc., яку придбав <span className="underline-span">Google</span> у 2014. Допомагає створювати <span className="underline-span">fullstack</span> застосунки з сервісами: <span className="underline-span">realtime</span> <span className="underline-span">databases,</span> <span className="underline-span">auth,</span> <span className="underline-span">security...</span></p>
            </div>
            <div className="content-item react">
              <h1 className="tech-title">React</h1>
              <p className="tech-explain"><span className="underline-span">React</span> — відкрита JavaScript <span className="underline-span">бібліотека</span> для створення інтерфейсів користувача, яка покликана вирішувати проблеми часткового оновлення вмісту вебсторінки, з якими стикаються в розробці односторінкових застосунків. Розроблено компанією <span className="underline-span">META</span></p>
            </div>
          </div>
        </section>
        <section className="fourth-section" id="resources">
          <div className="title-container">
            <h1>Resources</h1>
            <i className='bx bxs-leaf'></i>
          </div>
          <div className="resources-container">
            <div>
              <h1>Pexels</h1>
              <p>Free stock photos & videos<br/> you can use everywhere.<br/> Browse millions of high-quality royalty free<br/> stock images & copyright free pictures.</p>
            </div>
            <div>
              <h1>Youtube</h1>
              <p>Дивіться відео, слухайте улюблену музику,<br/>завантажуйте оригінальний контент<br/>і діліться всім цим із друзями,<br/> сім'єю й цілим світом на <span className="author-span">YouTube.</span></p>
            </div>
            <div>
              <h1>Boxicons</h1>
              <p><span className="author-span">Boxicons</span> is a free collection of carefully<br/> crafted open source icons.<br/>Each icon is designed on a 24px grid<br/>with the material guidelines.</p>
            </div>
          </div>
        </section>
      </main> 
      <footer className="home-footer">
        <a href="" className="home-logo-footer"><i className='bx bxs-chat'></i></a>
        <div className="footer-container">
          <div className="list-container">
            <h1>Browse:</h1>
            <ul className="footer-menu">
              <li className="menu-element-footer" onClick={(event) => scrollToSection(event, '#home')}>Home</li>
              <li className="menu-element-footer" onClick={(event) => scrollToSection(event, '#idea')}>Idea</li>
              <li className="menu-element-footer" onClick={(event) => scrollToSection(event, "#tech")}>Tech</li>
              <li className="menu-element-footer" onClick={(event) => scrollToSection(event, "#resources")}>Resources</li>
            </ul>
          </div>
          <div>
            <ul>
              <h1>Contact:</h1>
              <li className="menu-element-footer">
                <a href="mailto:kravetsa@sliceum.com" className="menu-element-footer">Email</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="copyright">
          <h1>&#169; 2025 All rights protected</h1>
        </div>
      </footer>
    </div>
  );
}