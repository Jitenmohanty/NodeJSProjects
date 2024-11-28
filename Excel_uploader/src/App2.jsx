// src/App.js
import React from "react";
import * as XLSX from "xlsx";

// JSON data
const jsonData = {
  stuId: "CAN002",
  name: "Miss Grady McDermott",
  email: "Hillary70@example.org",
  dp: "/public/images/dp/1720617527381yNpt8.jpeg",
  phone: "375-494-4596",
  whatsappNo: "649-603-3359",
  skills: [
    { skillName: "JavaScript", relevantExp: 13 },
    { skillName: "Node.js", relevantExp: 10 },
    { skillName: "React", relevantExp: 13 },
  ],
  isFresher: true,
  experience: "11 Months",
  experienceType: "Internship",
  stipend: 10000,
  currentCTC: 0,
  expectedCTC: 500000,
  noticePeriod: "Immediate",
  cv: "/public/docs/cv/1720617527382JZ4eh.pdf",
  currentStatus: "Processing",
  addedBy: { $oid: "668e1ff275b8171dd004e45e" },
  createdAt: { $date: "2024-07-10T13:18:47.528Z" },
  updatedAt: { $date: "2024-11-08T06:25:00.087Z" },
  __v: 1,
  address: {
    at: "RandomAddressAt",
    po: "RandomAddressPo",
    city: "RandomCity",
    dist: "RandomDist",
    state: "RandomState",
    country: "RandomCountry",
    pin: "90490",
  },
  gender: "Other",
  workDetails: [],
};

const App2 = () => {
  const handleExportToExcel = () => {
    // Extract data for each sheet
    const personalData = [
      {
        stuId: jsonData.stuId,
        name: jsonData.name,
        email: jsonData.email,
        phone: jsonData.phone,
        whatsappNo: jsonData.whatsappNo,
        isFresher: jsonData.isFresher,
        experience: jsonData.experience,
        experienceType: jsonData.experienceType,
        stipend: jsonData.stipend,
        currentCTC: jsonData.currentCTC,
        expectedCTC: jsonData.expectedCTC,
        noticePeriod: jsonData.noticePeriod,
        currentStatus: jsonData.currentStatus,
        gender: jsonData.gender,
      },
    ];

    const skillsData = jsonData.skills.map((skill) => ({
      skillName: skill.skillName,
      relevantExp: skill.relevantExp,
    }));

    const addressData = [
      {
        at: jsonData.address.at,
        po: jsonData.address.po,
        city: jsonData.address.city,
        dist: jsonData.address.dist,
        state: jsonData.address.state,
        country: jsonData.address.country,
        pin: jsonData.address.pin,
      },
    ];

    // Create worksheets from data
    const personalSheet = XLSX.utils.json_to_sheet(personalData);
    const skillsSheet = XLSX.utils.json_to_sheet(skillsData);
    const addressSheet = XLSX.utils.json_to_sheet(addressData);

    // Create a new workbook and append sheets
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, personalSheet, "Personal Data");
    XLSX.utils.book_append_sheet(workbook, skillsSheet, "Skills");
    XLSX.utils.book_append_sheet(workbook, addressSheet, "Address");

    // Export the Excel file
    XLSX.writeFile(workbook, "UserData.xlsx");
  };

  return (
    <div className="App">
      <h1>Export JSON to Excel</h1>
      <button onClick={handleExportToExcel}>Export to Excel</button>
    </div>
  );
};

export default App2;
