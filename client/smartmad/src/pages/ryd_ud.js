import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownWithSearch } from '../components/dropdown_med_søg.js';
import { AddCustomOption } from '../components/tilføj_egen_mulighed.js';
import { SelectedOptionsBox } from '../components/valgte_muligheder.js';
import { RecipeButton } from '../components/find_opskrifter_knap.js';
import { CommentsBox } from '../components/kommentar_boks.js';

export const ClearOut = () => {
  const [options] = useState(['Kylling', 'Bacon', 'Oksekød', 'Pasta', 'Kartofler', 'Ris', 'Løg', 'Broccoli', 'Peberfrugt']);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [comments, setComments] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  // Handle selection for the single dropdown
  const handleSelect = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
      setDropdownVisible(false);
    }
  };

  // Handle custom option addition
  const handleAddCustomOption = (option) => {
    if (!selectedOptions.includes(option)) {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Handle deselecting options
  const handleDeselect = (option) => {
    setSelectedOptions(selectedOptions.filter((item) => item !== option));
  };

  // Create JSON object
  const createJSON = () => {
    return {
      Options: selectedOptions,
      Comments: comments,
    };
  };

  // Handle JSON submission
  const handleSubmit = () => {
    const data = createJSON();
    console.log('Data to submit:', data);
    navigate('/find-opskrift');
  };

  return (
      <div className="max-w-md mx-auto">
          <label className="block mb-2 text-sm font-medium">Ryd ud her:</label>
          <p className="block mb-2 text-sm text-gray-200">(Her kan du indtaste alle de varer du gerne vil bruge til at
              rydde ud)</p>
          <SelectedOptionsBox selectedOptions={selectedOptions} onDeselect={handleDeselect}/>
          <DropdownWithSearch
              items={options}
              onSelect={handleSelect}
              isDropdownVisible={isDropdownVisible}
              setIsDropdownVisible={setDropdownVisible}
          />
          <p className="block mb-2 text-sm text-gray-200">(Er der ikke en varer på dropdown, så tilføjer du den bare
              selv her)</p>
          <AddCustomOption onAdd={handleAddCustomOption}/>

          {/* Comments Section */}
          <label className="block mt-4 mb-2 text-md font-medium">Har du en kommentar:</label>
          <p className="block mb-2 text-sm text-gray-200">(Det kan være allergier, specielle diæt forhold eller andet
              lignende)</p>
          <CommentsBox value={comments} onChange={setComments}/>

          {/* Submit Button using RecipeButton */}
          <RecipeButton onClick={handleSubmit}>
              Send Opskrift
          </RecipeButton>
      </div>
  );
};
