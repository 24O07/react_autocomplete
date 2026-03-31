// Auto.tsx
import React, { useState, useEffect } from 'react';
import { Person } from '../types/Person';

interface AutoProps {
  data: Person[];
  debounceTime?: number;
  onSelected: (person: Person | null) => void;
}

export const Auto: React.FC<AutoProps> = ({
  data,
  debounceTime = 300,
  onSelected,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Person[]>([]);
  const [dropdownActive, setDropdownActive] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Debounce filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue === '') {
        setSuggestions(data);
      } else {
        const filtered = data.filter(person =>
          person.name.toLowerCase().includes(inputValue.toLowerCase()),
        );

        setSuggestions(filtered);
      }

      setDropdownActive(true);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [inputValue, data, debounceTime]);

  // Reset selected person if input changes
  useEffect(() => {
    if (selectedPerson && selectedPerson.name !== inputValue) {
      setSelectedPerson(null);
      onSelected(null);
    }
  }, [inputValue, selectedPerson, onSelected]);

  const handleSelect = (person: Person) => {
    setInputValue(person.name);
    setSelectedPerson(person);
    onSelected(person);
    setDropdownActive(false);
  };

  return (
    <div className={`dropdown ${dropdownActive ? 'is-active' : ''}`} style={{ width: '300px' }}>
      <div className="dropdown-trigger">

        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={inputValue}
          data-cy="search-input" // <-- додаємо для тестів
          onFocus={() => {
            if (inputValue === '') {
              setSuggestions(data);
            }

            setDropdownActive(true);
          }}
          onChange={e => setInputValue(e.target.value)}
        />
      </div>

      {dropdownActive && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content"  data-cy="suggestions-list">
            {suggestions.length === 0 ? (
              <div className="dropdown-item has-text-danger"  data-cy="no-suggestions-message">
                No matching suggestions
              </div>
            ) : (
              suggestions.map(person => (
                <div
                  key={person.slug}
                  className="dropdown-item"
                  onClick={() => handleSelect(person)}
                  style={{ cursor: 'pointer' }}
                  data-cy="suggestion-item"
                >
                  {person.name}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
