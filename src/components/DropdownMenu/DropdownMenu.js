import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';

function DropdownMenu({ label = 'Selecionar', options = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    if (typeof option.onSelect === 'function') {
      option.onSelect(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button
        type="button"
        className="dropdown-trigger"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{label}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu" role="menu">
          {options.map((option, index) => (
            <li key={option.id || index} role="none">
              <button
                type="button"
                role="menuitem"
                className="dropdown-item"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DropdownMenu;
