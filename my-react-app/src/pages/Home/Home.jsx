import "./Home.css";
import { FaTwitter, FaFacebook, FaInstagram, FaSearch, FaGoogle } from "react-icons/fa";

const related = [
  { title: "Totoro", year: 1988 },
  { title: "Howl", year: 2004 },
  { title: "Ponyo", year: 2008 },
  { title: "Mononoke", year: 1997 },
  { title: "Nausicaa", year: 1984 },
];

const Home = () => {
  return (
    <div className="container">

      {/* BANNER */}
      <div className="banner">
        <div className="header">
            <div className="menu">☰</div>

            <div className="logo">RACSO</div>

            <div className="icons">
                <span><FaSearch /></span>
                <span><FaFacebook /></span>
                <span><FaTwitter /></span>
                <span><FaInstagram /></span>
                <span><FaGoogle /></span>
            </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content">

        <div className="left">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/d/db/Spirited_Away_Japanese_poster.png"
            alt=""
          />
        </div>

        <div className="right">
          <h2>SPIRITED AWAY (2001)</h2>
          <p className="genre">Animation | Adventure | Family</p>

          <div className="info">
            <span>Rating: PG</span>
            <span>125 mins</span>
            <span>$15M</span>
            <span>2003</span>
          </div>

          <p className="plot">
            During her family's move, a young girl wanders into a world ruled by
            gods, witches, and spirits.
          </p>

          <button className="btn">READ MORE</button>
        </div>
      </div>

      {/* TRAILER */}
      <div className="trailer">
        <h3>TRAILER</h3>
        <div className="video">▶</div>
      </div>

      {/* QUOTE */}
      <div className="quote">
        “Once you do something, you never forget.”
      </div>

      {/* RELATED */}
      <div className="related">
        <h2>RELATED MOVIES</h2>
        <div className="list">
          {related.map((m, i) => (
            <div key={i} className="card">
              <div className="poster"></div>
              <p>{m.title}</p>
              <span>{m.year}</span>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="footer">
        <p>© 2026 Movie UI</p>
      </div>
    </div>
  );
};

export default Home;