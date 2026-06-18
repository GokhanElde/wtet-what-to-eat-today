import "./Footer.css";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <p className="footer__author">Developed by Gokhan Eldeleklioglu</p>
      <p className="footer__year">&copy; {year}</p>
    </footer>
  );
};

export default Footer;
