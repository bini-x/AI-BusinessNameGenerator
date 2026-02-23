import axios from "axios";
import { useState } from "react";

function NameGenerator() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [names, setNames] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/generateNames",
        {
          description,
          category,
        },
      );

      if (response.data.success) {
        setNames(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFavoriteIdea = async (generatedName) => {
    try {
      await axios.post("http://localhost:3001/api/favoriteIdea", {
        description,
        category,
        generatedName,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="description"></label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your idea"
        />
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Choose a category</option>
          <option value="fun">Fun</option>
          <option value="descriptive">Descriptive</option>
          <option value="abstract">Abstract</option>
        </select>
        <button type="submit">Generate</button>
      </form>

      {names.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                {/* <th>.com Availability</th> */}
                <th>Do you like this?</th>
              </tr>
            </thead>
            <tbody>
              {names.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item}</td>
                    {/* <td>Available/Unavailable</td> */}
                    <td>
                      <button
                        className="border"
                        onClick={() => handleFavoriteIdea(item)}
                      >
                        Yes
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default NameGenerator;
