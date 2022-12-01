import "./App.css";
import { faker } from "@faker-js/faker";
import { useState, useEffect } from "react";
function App() {
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
  const [seed, setSeed] = useState(100);
  const [loc, setLoc] = useState("pl");
  const [errors, setErrors] = useState(0);
  faker.seed(seed);
  faker.setLocale(loc);
  useEffect(() => {
    setData(randomData.slice(0, 40));
  }, [randomData]);
  useEffect(() => {
    setRandomData([...createRandomData()]);
  }, [seed, loc, errors]);
  const loadMore = (e) => {
    const div = e.target;
    let bottom = div.scrollTop + div.clientHeight + 100 >= div.scrollHeight;
    if (bottom) {
      setData([...randomData.slice(0, data.length + 40)]);
      resetErrors();
    }
  };
  const generateSeed = (e) => {
    e.preventDefault();
    e.target.parentNode.childNodes[3].value = Math.floor(Math.random() * 500);
    changeData(e);
  };
  const changeData = (e) => {
    setSeed(Number(e.target.parentNode.childNodes[3].value));
    setLoc(e.target.parentNode.childNodes[1].value);
    numberOfErrors();
  };
  const numberOfErrors = () => {
    const form = document.querySelector("form");
    if (form.childNodes[6].value >= 1000) {
      form.childNodes[6].value = 1000;
    }
    const rangeValue = Number(form.childNodes[7].value);
    const inputValue = Number(form.childNodes[6].value);
    const errPerRec = inputValue ? inputValue : rangeValue;
    setErrors(errPerRec);
  };
  const randomPropertie = (obj) => {
    const keys = Object.keys(obj);
    return keys;
  };
  const delRandomChar = (str) => {
    let newstr = str.replace(
      str.charAt(faker.datatype.number({ min: 0, max: str.length - 1 })),
      ""
    );
    return newstr;
  };
  const changeRandomChars = (str) => {
    let randomLetterIndex = faker.datatype.number({
      min: 0,
      max: str.length - 1,
    });
    let letterOne = str.charAt(randomLetterIndex);
    let letterTwo = str.charAt(randomLetterIndex + 1);
    let newstr = str.replace(letterOne + letterTwo, letterTwo + letterOne);
    return newstr;
  };
  const addRandomChar = (str) => {
    let randomLetterIndex = faker.datatype.number({
      min: 1,
      max: str.length - 1,
    });
    let newstr =
      str.slice(0, randomLetterIndex) +
      faker.datatype.string(1) +
      str.slice(randomLetterIndex);
    return newstr;
  };
  useEffect(() => {
    let errPerRec = errors;
    if (!errPerRec) return;
    let newData = [];
    data.forEach((rec) => {
      if (errors < 1 && rec.index % 2 == 0) {
        newData.push(rec);
        return;
      }
      if (errors < 1) errPerRec = 1;
      let newrec = rec;
      for (let i = 0; i < errors; i++) {
        let prop =
          randomPropertie(newrec)[faker.datatype.number({ min: 1, max: 3 })];
        let errorType = faker.datatype.number({ min: 1, max: 3 });
        if (errorType == 1 && newrec[`${prop}`].length > 5) {
          newrec[`${prop}`] = delRandomChar(newrec[`${prop}`]);
        } else if (errorType == 2 && newrec[`${prop}`].length < 20) {
          newrec[`${prop}`] = addRandomChar(newrec[`${prop}`]);
        } else {
          newrec[`${prop}`] = changeRandomChars(newrec[`${prop}`]);
        }
      }
      newData.push(newrec);
    });
    setData([...newData]);
  }, [randomData, errors]);
  const resetErrors = () => {
    const form = document.querySelector("form");
    form.childNodes[7].value = 0;
    form.childNodes[6].value = 0;
  };
  return (
    <div className="App">
      <form onChange={changeData}>
        <label htmlFor="region">Choose a region:</label>
        <select name="region" id="region" onChange={resetErrors}>
          <option value="pl">Poland</option>
          <option value="en_US">USA</option>
          <option value="de">Germany</option>
        </select>
        <label htmlFor="seed">Choose random seed value:</label>
        <input id="seed" type="number" defaultValue="100" />
        <button onClick={generateSeed}>Random seed value</button>
        <label htmlFor="errors">
          Choose number of errors per one record(max 1000):
        </label>
        <input type="number" id="errors" defaultValue="0" />
        <input type="range" defaultValue="0" max="10" step="0.5" />
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
