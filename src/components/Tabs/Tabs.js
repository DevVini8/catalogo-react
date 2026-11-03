import React, { useState } from 'react';
import './Tabs.css';

function Tabs({ tabs = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!tabs.length) {
    return null;
  }

  const currentTab = tabs[activeIndex] || tabs[0];

  return (
    <div className="tabs">
      <div className="tabs-header" role="tablist" aria-label="Abas de conteúdo">
        {tabs.map((tab, index) => {
          const isSelected = index === activeIndex;
          return (
            <button
              key={tab.id || index}
              type="button"
              role="tab"
              id={`tab-${tab.id || index}`}
              aria-selected={isSelected}
              aria-controls={`tabpanel-${tab.id || index}`}
              className={`tab-btn ${isSelected ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {tab.title}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`tabpanel-${currentTab.id || activeIndex}`}
        aria-labelledby={`tab-${currentTab.id || activeIndex}`}
        className="tab-panel"
      >
        <p className="tab-text">{currentTab.content}</p>
      </div>
    </div>
  );
}

export default Tabs;
