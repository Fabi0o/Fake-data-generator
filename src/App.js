import "./App.css";
import { faker } from "@faker-js/faker";
import { useState, useEffect } from "react";
function App() {
  faker.seed(100);
  faker.setLocale("pl");
  const createRandomData = () => {
    let objects = [];
    for (let i = 0; i < 1000; i++) {
      let obj = {
        index: objects.length + 1,
        name: faker.name.fullName(),
        address: `${faker.address.cityName()} ${faker.address.streetAddress()}`,
        phone: faker.phone.number(),
      };
      objects.push(obj);
    }
    return objects;
  };
  const [randomData, setRandomData] = useState(createRandomData());
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(randomData.slice(0, 41));
  }, [randomData]);
  const loadMore = (e) => {
    const div = e.target;
    let bottom = div.scrollTop + div.clientHeight + 100 >= div.scrollHeight;
    if (bottom) {
      setData([...randomData.slice(0, data.length + 40)]);
    }
  };
  const generateSeed = (e) => {
    e.preventDefault();
    e.target.parentNode.childNodes[3].value = Math.floor(Math.random() * 500);
    changeData(e);
  };
  const changeData = (e) => {
    faker.seed(Number(e.target.parentNode.childNodes[3].value));
    faker.setLocale(e.target.parentNode.childNodes[1].value);
    setRandomData([...createRandomData()]);
  };
  return (
    <div className="App">
      <form onChange={changeData}>
        <label htmlFor="region">Choose a region:</label>
        <select name="region" id="region">
          <option value="pl">Poland</option>
          <option value="en_US">USA</option>
          <option value="de">Germany</option>
        </select>
        <label htmlFor="seed">Choose random seed value:</label>
        <input type="number" defaultValue="100" />
        <button onClick={generateSeed}>Random seed value</button>
      </form>
      <div id="tableContainer" onScroll={loadMore}>
        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>Address</th>
              <th>Phone number</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              return (
                <tr key={item.index}>
                  <th>{item.index}</th>
                  <th>{item.name}</th>
                  <th>{item.address}</th>
                  <th>{item.phone}</th>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
