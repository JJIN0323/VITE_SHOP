import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NavItem from './Sections/NavItem';

const Navbar = () => {
  const [menu, setMenu] = useState(false); // State to toggle the mobile menu
  const [isScrolled, setIsScrolled] = useState(false); // State to track if the page is scrolled

  // Function to toggle the menu
  const handleMenu = () => {
    setMenu(!menu);
  };

  // Scroll event handling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        // Set isScrolled to true if the user scrolls more than 50px
        setIsScrolled(true);
      } else {
        // Set isScrolled to false if the user scrolls back to the top
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      className="nav"
      style={{
        // Dynamically set background color and shadow based on scroll state
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : '#fff',
        boxShadow: isScrolled ? '0px 2px 10px rgba(0, 0, 0, 0.1)' : 'none',
        transition: 'background-color 0.3s, box-shadow 0.3s', // Smooth transition effects
      }}
    >
      <div className="logoNmenu">
        {/* Logo section */}
        <div>
          <Link to="/">SHOP</Link> {/* Link to the home page */}
        </div>

        {/* Mobile menu button */}
        <div className="menuButton" style={{ display: 'none' }}>
          <button onClick={handleMenu}>{menu ? '-' : '+'}</button> {/* Toggle button for the menu */}
        </div>

        {/* Navigation items for larger screens */}
        <div className="hidden sm:block">
          <NavItem /> {/* Render the navigation items */}
        </div>
      </div>

      {/* Navigation items for smaller screens */}
      <div className="block sm:hidden" style={{ display: 'none' }}>
        {menu && <NavItem mobile />} {/* Render mobile navigation items if menu is toggled */}
      </div>
    </section>
  );
};

export default Navbar;
