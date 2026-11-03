import React, { useState } from 'react';
import './Accordion.css';

function Accordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="accordion">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const headerId = `accordion-header-${item.id || index}`;
        const panelId = `accordion-panel-${item.id || index}`;

        return (
          <div
            key={item.id || index}
            className={`accordion-item ${isOpen ? 'is-open' : ''}`}
          >
            <h3 className="accordion-heading">
              <button
                type="button"
                id={headerId}
                className="accordion-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(index)}
              >
                <span>{item.title}</span>
                <span className="accordion-arrow" aria-hidden="true">
                  ▾
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="accordion-panel-wrapper"
              aria-hidden={!isOpen}
            >
              <div className="accordion-panel-inner">
                <p className="accordion-content">{item.content}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
