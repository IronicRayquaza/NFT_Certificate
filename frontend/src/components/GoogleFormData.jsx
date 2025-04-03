import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/GoogleFormData.css"; // Ensure you have this CSS file for styling

const GoogleFormData = () => {
  const [data, setData] = useState([]);
  
  const sheetId = "1z01tSHzfTOXxTTL888LxbmOFhGUJWQmcDbjFfxclwUA";
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY; // Ensure this is not undefined
  const range = "Form Responses 1";  

  console.log("API Key:", apiKey); // Debugging step

//   const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
// const url = `https://sheets.googleapis.com/v4/spreadsheets/1z01tSHzfTOXxTTL888LxbmOFhGUJWQmcDbjFfxclwUA?key=AIzaSyBbnjxZ4ow31wroa_CpwN-EIZM_vU9fxzk`;
const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  useEffect(() => {
    axios.get(url)
      .then(response => {
        if (response.data && response.data.values) {
          setData(response.data.values);
        } else {
          console.error("No data found in the sheet.");
        }
      })
      .catch(error => {
        console.error("Error fetching data from Google Sheets:", error);
      });
  }, [url]);

  return (
    <div>
      <h1>Form Responses</h1>
      {data.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {data[0]?.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.slice(1).map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GoogleFormData;
