// components/SchoolDropdown.jsx
import React from "react";

const SchoolDropdown = ({ schools, onSelect }) => {
  return (
    <select onChange={(e) => onSelect(e.target.value)} className="p-2 border rounded">
      <option value="">Select School</option>
      {schools.map((school) => (
        <option key={school} value={school}>
           (ID: {school})
        </option>
      ))}
    </select>
  );
};

export default SchoolDropdown;


