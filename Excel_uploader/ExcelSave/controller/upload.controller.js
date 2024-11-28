import XLSX from "xlsx";
import { Data } from "../model/excelData.model.js";

export const uploadData = async (req, res) => {
  try {
    // Read the uploaded Excel file
    const workbook = XLSX.readFile(req.file.path);

    // Get the first sheet name
    const sheetName = workbook.SheetNames[0];

    // Get the first sheet
    const sheet = workbook.Sheets[sheetName];

    // Convert the sheet to JSON
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    // Log the JSON data (for debugging)
    // console.log(jsonData);
    let insertData = [];
    for (let i = 0; i < jsonData.length; i++) {
      insertData.push({
        SL_NO: jsonData[i].SL_NO,
        VILLAGE_COLLECTION: jsonData[i].VILLAGE_COLLECTION,
        AMOUNT: jsonData[i].AMOUNT,
      });
    }
    console.log(insertData);
    await Data.insertMany(insertData);

    // Send success response
    res.send({
      status: 200,
      success: true,
      msg: "Excel file processed successfully",
      data: jsonData,
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

export const getData = async (req, res) => {
  try {
    const userData = await Data.find({}, { _id: 0, __v: 0 });

    // console.log(userData)
    return res.send({
      status: 200,
      data: userData,
      msg: "Data successfully fetch",
    });
  } catch (error) {
    console.log(error, "Error on getting userData");
    return res.send({
      status: 500,
      success: false,
      msg: "Error processing the file",
    });
  }
};

export const filterData = async (req, res) => {
  try {
    const fdata = await Data.find({
      VILLAGE_COLLECTION: { $regex: /NABA KISHORE MOHANTY/i },
    });
    console.log(fdata);
    res.status(200).json({
      success: true,
      data: fdata,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
