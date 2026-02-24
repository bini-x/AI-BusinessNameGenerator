import axios from "axios";
import { useState } from "react";
const VITE_API_URL = import.meta.env.VITE_API_URL;

function NameGenerator() {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [names, setNames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${VITE_API_URL}api/generateNames`, {
        description,
        category,
      });
      if (response.data.success) {
        setNames(response.data.data);
        setFavorites([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteIdea = async (generatedName) => {
    if (favorites.includes(generatedName)) return;
    try {
      await axios.post(`${VITE_API_URL}api/favoriteIdea`, {
        description,
        category,
        generatedName,
      });
      setFavorites((prev) => [...prev, generatedName]);
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setDescription("");
    setCategory("");
    setNames([]);
    setFavorites([]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-sm">
        <div className="mb-10">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            AI Business Name Generator
          </h1>
        </div>

        <div className="mb-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Description
              </label>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain your business idea"
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-gray-400 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-gray-400 transition-colors cursor-pointer appearance-none bg-white"
              >
                <option value="">Select one...</option>
                <option value="fun">Fun</option>
                <option value="descriptive">Descriptive</option>
                <option value="abstract">Abstract</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white text-sm font-medium rounded-lg py-2.5 transition-colors cursor-pointer mt-1"
            >
              {loading
                ? "Generating..."
                : names.length > 0
                  ? "Regenerate"
                  : "Generate"}
            </button>
          </form>
        </div>

        {names.length > 0 && (
          <div className="border-t border-gray-100 pt-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 pb-2">
                    Results
                    <button
                      onClick={resetForm}
                      className="ml-2 text-gray-300 hover:text-gray-500 transition-colors cursor-pointer"
                    >
                      Reset
                    </button>
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 pb-2">
                    .com
                  </th>
                  <th className="text-right text-xs font-medium text-gray-400 pb-2">
                    Do you like this?
                  </th>
                </tr>
              </thead>
              <tbody>
                {names.map((item, index) => {
                  const isFav = favorites.includes(item.name);
                  return (
                    <tr
                      key={index}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-3 text-gray-800 text-left">
                        {item.name}
                        <span className="block text-xs text-gray-400">
                          {item.domain}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-xs text-right ${item.available ? "text-green-500" : "text-red-400"}`}
                      >
                        {item.available ? "Available" : "Unavailable"}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleFavoriteIdea(item.name)}
                          className={`text-xs font-medium text-right px-3 py-1 rounded-md transition-all cursor-pointer ${
                            isFav
                              ? "bg-green-50 text-green-600"
                              : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {isFav ? "✓ Liked" : "Yes"}
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
    </div>
  );
}

export default NameGenerator;
