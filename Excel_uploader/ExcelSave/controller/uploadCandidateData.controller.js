import { Candidate } from "../model/candidateModel.js";

const getIDSequence = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(Math.random() + 10);
    }, 2000);
  });
};

export const uploadCandidateDataExcelFile = async (req, res) => {
  try {
    
    const { data: excelData } = req.body;

    // Log the JSON data (for debugging)
    console.log(excelData);
    let insertData = [];
    for (let i = 0; i < excelData.length; i++) {
      insertData.push({
        stuId: await getIDSequence(),
        name: excelData[i].name || "",
        dp: "",
        gender: "",
        email: excelData[i]?.email,
        phone: excelData[i]?.phone,
        skills: [{ skillName: excelData[i]?.skills, relevantExp: 0 }],
        isFresher: excelData[i]?.isFresher || false,
        experience: excelData[i]?.experience || "",
        experienceType: excelData[i]?.experienceType || "NA",
        stipend: excelData[i]?.stipend || "",
        currentCTC: excelData[i]?.currentCTC || "",
        expectedCTC: excelData[i]?.expectedCTC || "",
        noticePeriod: excelData[i]?.noticePeriod || "",
        address: { state: excelData[i]?.address },
        workDetails: [{ companyName: excelData[i]?.CurrentOrganization }],
        cv: "",
        otherDetails: "",
      });
    }
    console.log(insertData);
    // await Candidate.insertMany(insertData);

    // Send success response
    res.send({
      status: 200,
      success: true,
      msg: "Excel file processed successfully",
      data: excelData,
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.send({
      status: 500,
      success: false,
      msg: "Error processing the file",
    });
  }
};

