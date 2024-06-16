import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const App = () => {
  const [search, setSearch] = useState("");
  const [pinCode, setPinCode] = useState("400061");
  const [data, setData] = useState([]);
  const [gender, setGender] = useState("female");
  const [priceOrder, setPriceOrder] = useState("Low to High");
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const result = await axios.get("http://localhost:3000/users");
      setData(result.data);
    };
    getData();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((cat) => cat !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const filteredData = data
    .filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase()))
    .filter((doc) => doc.pincode.includes(pinCode))
    .filter((doc) => doc.gender === gender)
    .filter((doc) =>
      selectedCategories.length > 0
        ? selectedCategories.includes(doc.cat)
        : true
    )
    .sort((a, b) =>
      priceOrder === "Low to High" ? a.price - b.price : b.price - a.price
    );

  return (
    <div>
      <div>
        <div className="search_bar">
          <input
            placeholder="search name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
          />
          <input
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value)}
            type="text"
          />
        </div>
        <div className="full_screen">
          <div className="main">
            <div>
              <FormControl>
                <RadioGroup
                  aria-labelledby="price-order-group-label"
                  value={priceOrder}
                  name="price-order-group"
                  onChange={(e) => setPriceOrder(e.target.value)}
                >
                  <FormControlLabel
                    value="Low to High"
                    control={<Radio />}
                    label="Low to High"
                  />
                  <FormControlLabel
                    value="High to Low"
                    control={<Radio />}
                    label="High to Low"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div>
              <FormControl>
                <FormLabel id="gender-group-label">Gender</FormLabel>
                <RadioGroup
                  aria-labelledby="gender-group-label"
                  value={gender}
                  name="gender-group"
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <div className="check">
              {data.map((doc) => (
                <div className="cat" key={doc._id}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(doc.cat)}
                    onChange={() => handleCategoryChange(doc.cat)}
                  />
                  <p>{doc.cat}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="list_data">
            {filteredData.map((doc) => (
              <div className="card" key={doc._id}>
                <p> {doc.name}</p>
                <p> {doc.cat}</p>
                <p> {doc.price}</p>
                <p> {doc.gender}</p>
                <p> {doc.pincode}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
