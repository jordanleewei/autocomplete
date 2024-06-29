import React, { useState, useRef, useEffect } from 'react';
import { useFloating, shift } from '@floating-ui/react-dom';
import './Autocomplete.css';

interface AutocompleteProps<T> {
  label: string;
  description?: string;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  onChange?: (value: T | T[] | null) => void;
  onInputChange?: (inputValue: string) => void;
  options: T[];
  placeholder?: string;
  renderOption?: (option: T) => React.ReactNode;
  value?: T | T[] | null;
  filterOptions?: (options: T[], inputValue: string) => T[];
}

const Autocomplete = <T extends { name: string; color: string }>({
  label,
  description,
  disabled = false,
  loading = false,
  multiple = false,
  onChange,
  onInputChange,
  options,
  placeholder = 'Search...',
  renderOption,
  value = [],
  filterOptions,
}: AutocompleteProps<T>) => {
  const [inputValue, setInputValue] = useState('');
  const [filteredOptions, setFilteredOptions] = useState<T[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);

  const { x, y, strategy, refs, update } = useFloating({
    placement: 'bottom-start',
    middleware: [shift()],
  });

  useEffect(() => {
    if (inputRef.current) refs.setReference(inputRef.current);
    if (listRef.current) refs.setFloating(listRef.current);
  }, [refs]);

  useEffect(() => {
    if (isDropdownOpen) update();
  }, [isDropdownOpen, update, inputValue]);

  useEffect(() => {
    if (listRef.current && isDropdownOpen) {
      const focusedOption = listRef.current.children[focusedIndex];
      if (focusedOption) {
        focusedOption.scrollIntoView({
          block: 'nearest',
        });
      }
    }
  }, [focusedIndex, isDropdownOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onInputChange?.(value);

    if (value) {
      const normalizedValue = value.toLowerCase();
      const filtered = filterOptions
        ? filterOptions(options, value)
        : options
            .filter((option) => option.name.toLowerCase().includes(normalizedValue))
            .sort((a, b) => {
              const aStartsWith = a.name.toLowerCase().startsWith(normalizedValue);
              const bStartsWith = b.name.toLowerCase().startsWith(normalizedValue);
              if (aStartsWith && !bStartsWith) return -1;
              if (!aStartsWith && bStartsWith) return 1;
              return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
            });

      setFilteredOptions(filtered);
      setIsDropdownOpen(filtered.length > 0);
    } else {
      setIsDropdownOpen(false);
    }
  };

  const handleSuggestionClick = (suggestion: T) => {
    if (multiple && Array.isArray(value)) {
      const newValue = value.includes(suggestion)
        ? value.filter((item) => item !== suggestion)
        : [...value, suggestion];
      onChange?.(newValue);
      setInputValue('');
    } else {
      onChange?.(suggestion);
      setInputValue(suggestion.name);
      setIsDropdownOpen(false);
    }
  };

  const handleClearSelection = () => {
    onChange?.(multiple ? [] : null);
    setInputValue('');
  };

  const handleInputFocus = () => {
    setFilteredOptions(options);
    setIsDropdownOpen(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(event.target as Node) &&
      listRef.current &&
      !listRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % filteredOptions.length);
    } else if (e.key === 'ArrowUp') {
      setFocusedIndex(
        (prevIndex) => (prevIndex - 1 + filteredOptions.length) % filteredOptions.length
      );
    } else if (e.key === 'Enter') {
      const option = filteredOptions[focusedIndex];
      if (option) handleSuggestionClick(option);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-64">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative flex items-center">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="w-full p-2 border border-gray-300 rounded pr-10"
          placeholder={placeholder}
        />
        {multiple && Array.isArray(value) && value.length > 0 && (
          <div className="absolute inset-y-0 right-10 flex items-center pr-3 space-x-2">
            {value.map((item, index) => (
              <span
                key={index}
                className="flex items-center space-x-1 bg-gray-200 rounded-full px-2 py-1 text-xs"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span>{item.name}</span>
              </span>
            ))}
            <button
              type="button"
              onClick={handleClearSelection}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              &times;
            </button>
          </div>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="spinner w-5 h-5 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      {isDropdownOpen && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: '100%',
            marginTop: '4rem',
          }}
          className="absolute z-10 bg-white border border-gray-300 rounded shadow-lg autocomplete-dropdown"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(option)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                focusedIndex === index ? 'bg-gray-100' : ''
              }`}
            >
              {renderOption ? renderOption(option) : option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Autocomplete;
