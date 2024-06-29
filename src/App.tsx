import React, { useState } from 'react';
import DebouncedAutocomplete from './DebouncedAutocomplete';
import Autocomplete from './Autocomplete';

const suggestions = [
  { name: 'apple', color: 'red' },
  { name: 'banana', color: 'yellow' },
  { name: 'cherry', color: 'red' },
  { name: 'fig', color: 'purple' },
  { name: 'grape', color: 'purple' },
  { name: 'kiwi', color: 'green' },
  { name: 'lemon', color: 'yellow' },
  { name: 'mango', color: 'orange' },
  { name: 'nectarine', color: 'orange' },
  { name: 'orange', color: 'orange' },
  { name: 'papaya', color: 'orange' },
  { name: 'pear', color: 'green' },
  { name: 'pineapple', color: 'yellow' },
  { name: 'plum', color: 'purple' },
  { name: 'raspberry', color: 'red' },
  { name: 'strawberry', color: 'red' },
  { name: 'watermelon', color: 'green' },
];

const App: React.FC = () => {
  const [selectedFruit, setSelectedFruit] = useState<{ name: string, color: string } | null>(null);
  const [selectedFruitsDebounced, setSelectedFruitsDebounced] = useState<{ name: string, color: string } | null>(null);
  const [selectedMultipleFruits, setSelectedMultipleFruits] = useState<{ name: string, color: string }[]>([]);

  const handleRegularChange = (value: { name: string, color: string } | { name: string, color: string }[] | null) => {
    if (!Array.isArray(value)) {
      setSelectedFruit(value);
    }
  };

  const handleDebouncedChange = (value: { name: string, color: string } | { name: string, color: string }[] | null) => {
    if (!Array.isArray(value)) {
      setSelectedFruitsDebounced(value);
    }
  };

  const handleMultipleChange = (value: { name: string, color: string } | { name: string, color: string }[] | null) => {
    if (Array.isArray(value)) {
      setSelectedMultipleFruits(value);
    }
  };

  const handleInputChange = (inputValue: string) => {
    console.log('Input value:', inputValue);
  };

  const customFilterOptions = (options: { name: string, color: string }[], inputValue: string) => {
    return options.filter(option =>
      option.name.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex space-x-8">
        <div>
          <h2 className="text-center mb-4">Regular Autocomplete</h2>
          <Autocomplete
            label="Make a Fruit Salad"
            description=""
            options={suggestions}
            onChange={handleRegularChange}
            onInputChange={handleInputChange}
            placeholder="Search fruits..."
            filterOptions={customFilterOptions}
            renderOption={option => (
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: option.color }}></span>
                {option.name}
              </div>
            )}
            value={selectedFruit}
          />
        </div>
        <div>
          <h2 className="text-center mb-4">Debounced Autocomplete</h2>
          <DebouncedAutocomplete
            label="Make a Fruit Salad"
            description=""
            options={suggestions}
            onChange={handleDebouncedChange}
            onInputChange={handleInputChange}
            placeholder="Search fruits..."
            filterOptions={customFilterOptions}
            renderOption={option => (
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: option.color }}></span>
                {option.name}
              </div>
            )}
            debounceDelay={300} // Debounce delay in milliseconds
            value={selectedFruitsDebounced}
          />
        </div>
        <div>
          <h2 className="text-center mb-4">Multiple Select Autocomplete</h2>
          <Autocomplete
            label="Select Multiple Fruits"
            description=""
            options={suggestions}
            multiple
            onChange={handleMultipleChange}
            onInputChange={handleInputChange}
            placeholder="Search fruits..."
            filterOptions={customFilterOptions}
            renderOption={option => (
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: option.color }}></span>
                {option.name}
              </div>
            )}
            value={selectedMultipleFruits}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
