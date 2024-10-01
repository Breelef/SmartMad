import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DropdownWithSearch } from '../components/dropdown_med_søg.js';
import { AddCustomOption } from '../components/tilføj_egen_mulighed.js';
import { SelectedOptionsBox } from '../components/valgte_muligheder.js';
import { RecipeButton } from '../components/find_opskrifter_knap.js';
import { PeopleCounter } from "../components/portion_tæller.js";
import { CommentsBox } from '../components/kommentar_boks.js'; // Import CommentsBox

export const ChooseSelf = () => {
  const [proteinOptions] = useState(['Kylling', 'Bacon', 'Oksekød']);
  const [carbOptions] = useState(['Pasta', 'Kartofler', 'Ris']);
  const [veggieOptions] = useState(['Løg', 'Broccoli', 'Peberfrugt']);
  const [spiceOptions] = useState(['Salt', 'Chili', 'Oregano']);
  const [peopleCount, setPeopleCount] = useState(0);
  const navigate = useNavigate();

  const [selectedProtein, setSelectedProtein] = useState([]);
  const [selectedCarbs, setSelectedCarbs] = useState([]);
  const [selectedVeggies, setSelectedVeggies] = useState([]);
  const [selectedSpices, setSelectedSpices] = useState([]);

  const [comments, setComments] = useState(''); // State for comments

  const [isProteinDropdownVisible, setProteinDropdownVisible] = useState(false);
  const [isCarbDropdownVisible, setCarbDropdownVisible] = useState(false);
  const [isVeggieDropdownVisible, setVeggieDropdownVisible] = useState(false);
  const [isSpiceDropdownVisible, setSpiceDropdownVisible] = useState(false);

  // Handle selection for each category
  const handleSelect = (option, category) => {
    if (category === 'Protein' && !selectedProtein.includes(option)) {
      setSelectedProtein([...selectedProtein, option]);
      setProteinDropdownVisible(false);
    } else if (category === 'Kulhydrat' && !selectedCarbs.includes(option)) {
      setSelectedCarbs([...selectedCarbs, option]);
      setCarbDropdownVisible(false);
    } else if (category === 'Grøntsager' && !selectedVeggies.includes(option)) {
      setSelectedVeggies([...selectedVeggies, option]);
      setVeggieDropdownVisible(false);
    } else if (category === 'Andet' && !selectedSpices.includes(option)) {
      setSelectedSpices([...selectedSpices, option]);
      setSpiceDropdownVisible(false);
    }
  };

  // Handle custom option addition
  const handleAddCustomOption = (option, category) => {
    if (category === 'Protein' && !selectedProtein.includes(option)) {
      setSelectedProtein([...selectedProtein, option]);
    } else if (category === 'Kulhydrat' && !selectedCarbs.includes(option)) {
      setSelectedCarbs([...selectedCarbs, option]);
    } else if (category === 'Grøntsager' && !selectedVeggies.includes(option)) {
      setSelectedVeggies([...selectedVeggies, option]);
    } else if (category === 'Andet' && !selectedSpices.includes(option)) {
      setSelectedSpices([...selectedSpices, option]);
    }
  };

  // Handle deselecting options
  const handleDeselect = (option, category) => {
    if (category === 'Protein') {
      setSelectedProtein(selectedProtein.filter((item) => item !== option));
    } else if (category === 'Kulhydrat') {
      setSelectedCarbs(selectedCarbs.filter((item) => item !== option));
    } else if (category === 'Grøntsager') {
      setSelectedVeggies(selectedVeggies.filter((item) => item !== option));
    } else if (category === 'Andet') {
      setSelectedSpices(selectedSpices.filter((item) => item !== option));
    }
  };

  // Create JSON object
  const createJSON = () => {
    return {
      Protein: selectedProtein,
      Kulhydrat: selectedCarbs,
      Grøntsager: selectedVeggies,
      Comments: comments, // Include comments in the JSON
      Andet: selectedSpices,
      Mængde: peopleCount,
    };
  };

  // Handle JSON submission
  const handleSubmit = () => {
    const data = createJSON();
    console.log("Data to submit: ", data);

    navigate('/find-opskrift');
  };

  return (
      <div className="max-w-md mx-auto">
          <label className="block mb-2 text-md font-medium">Antal portioner: </label>
          <PeopleCounter value={peopleCount} onChange={setPeopleCount} />
          <label className="block mb-2 text-md font-medium">Vælg Protein:</label>
          <SelectedOptionsBox selectedOptions={selectedProtein}
                              onDeselect={(option) => handleDeselect(option, 'Protein')}/>
          <DropdownWithSearch
              items={proteinOptions}
              onSelect={(option) => handleSelect(option, 'Protein')}
              isDropdownVisible={isProteinDropdownVisible}
              setIsDropdownVisible={setProteinDropdownVisible}
          />
          <p className="block mb-2 text-sm text-gray-200">(Er der ikke en varer på dropdown, så tilføjer du den bare
              selv her)</p>
          <AddCustomOption onAdd={(option) => handleAddCustomOption(option, 'Protein')}/>

          <label className="block mt-4 mb-2 text-md font-medium">Vælg Kulhydrat:</label>
          <SelectedOptionsBox selectedOptions={selectedCarbs}
                              onDeselect={(option) => handleDeselect(option, 'Kulhydrat')}/>
          <DropdownWithSearch
              items={carbOptions}
              onSelect={(option) => handleSelect(option, 'Kulhydrat')}
              isDropdownVisible={isCarbDropdownVisible}
              setIsDropdownVisible={setCarbDropdownVisible}
          />
          <p className="block mb-2 text-sm text-gray-200">(Er der ikke en varer på dropdown, så tilføjer du den bare
              selv her)</p>
          <AddCustomOption onAdd={(option) => handleAddCustomOption(option, 'Kulhydrat')}/>

          <label className="block mt-4 mb-2 text-md font-medium">Vælg Grøntsager:</label>
          <SelectedOptionsBox selectedOptions={selectedVeggies}
                              onDeselect={(option) => handleDeselect(option, 'Grøntsager')}/>
          <DropdownWithSearch
              items={veggieOptions}
              onSelect={(option) => handleSelect(option, 'Grøntsager')}
              isDropdownVisible={isVeggieDropdownVisible}
              setIsDropdownVisible={setVeggieDropdownVisible}
          />
          <p className="block mb-2 text-sm text-gray-200">(Er der ikke en varer på dropdown, så tilføjer du den bare
              selv her)</p>
          <AddCustomOption onAdd={(option) => handleAddCustomOption(option, 'Grøntsager')}/>

          <label className="block mt-4 mb-2 text-md font-medium">Vælg Andet:</label>
          <p className="block mb-2 text-sm text-gray-200">(Her kan vælge varer som kryderrier, sovse og andet du gerne vil inkludere)</p>
          <SelectedOptionsBox selectedOptions={selectedSpices}
                              onDeselect={(option) => handleDeselect(option, 'Andet')}/>
          <DropdownWithSearch
              items={spiceOptions}
              onSelect={(option) => handleSelect(option, 'Andet')}
              isDropdownVisible={isSpiceDropdownVisible}
              setIsDropdownVisible={setSpiceDropdownVisible}
          />
          <p className="block mb-2 text-sm text-gray-200">(Er der ikke en varer på dropdown, så tilføjer du den bare
              selv her)</p>
          <AddCustomOption onAdd={(option) => handleAddCustomOption(option, 'Andet')}/>

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
