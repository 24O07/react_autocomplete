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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  // Debounce filtering
  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmedValue = inputValue.trim();

      if (trimmedValue === '') {
        // Якщо інпут порожній, але відкритий — показуємо всі дані
        if (isDropdownOpen) {
          setSuggestions(data);
        } else {
          setSuggestions([]);
        }
      } else {
        const filtered = data.filter(person =>
          person.name.toLowerCase().includes(trimmedValue.toLowerCase()),
        );
        setSuggestions(filtered);
      }
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [inputValue, data, debounceTime, isDropdownOpen]);

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
    setIsDropdownOpen(false);
  };

  return (
    <div className={`dropdown ${isDropdownOpen ? 'is-active' : ''}`} style={{ width: '300px' }}>
      <div className="dropdown-trigger">
        <input
          type="text"
          className="input"
          placeholder="Enter a part of the name"
          value={inputValue}
          data-cy="search-input"
          onFocus={() => {
            setIsDropdownOpen(true);
            const trimmedValue = inputValue.trim();
            if (trimmedValue === '') {
              setSuggestions(data); // показуємо всі варіанти при порожньому інпуті
            } else {
              setSuggestions(
                data.filter(person =>
                  person.name.toLowerCase().includes(trimmedValue.toLowerCase()),
                ),
              );
            }
          }}
          onChange={e => setInputValue(e.target.value)}
          onBlur={() => {
            // Якщо потрібно, можна закривати dropdown при виході з інпуту
            // setIsDropdownOpen(false);
          }}
        />
      </div>

      {isDropdownOpen && (
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">
            {suggestions.length === 0 ? (
              <div className="dropdown-item has-text-danger" data-cy="no-suggestions-message">
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
