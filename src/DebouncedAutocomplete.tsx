import React, { useState, useEffect } from 'react';
import Autocomplete from './Autocomplete';

interface DebouncedAutocompleteProps<T> {
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
  debounceDelay?: number;
}

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const DebouncedAutocomplete = <T extends { name: string; color: string }>({
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
  value = null,
  filterOptions,
  debounceDelay = 300,
}: DebouncedAutocompleteProps<T>) => {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const debouncedInputValue = useDebounce(inputValue, debounceDelay);

  useEffect(() => {
    setIsLoading(false);
    onInputChange?.(debouncedInputValue);
  }, [debouncedInputValue, onInputChange]);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsLoading(true);
  };

  return (
    <Autocomplete
      label={label}
      description={description}
      disabled={disabled}
      loading={loading || isLoading}
      multiple={multiple}
      onChange={onChange}
      onInputChange={handleInputChange}
      options={options}
      placeholder={placeholder}
      renderOption={renderOption}
      value={value}
      filterOptions={filterOptions}
    />
  );
};

export default DebouncedAutocomplete;
