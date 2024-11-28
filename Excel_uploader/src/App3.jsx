import React, { useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Box,
  Heading,
} from "@chakra-ui/react";

const App3 = () => {
  const [jsonData, setJsonData] = useState([]);

  const handleSubmit = async () => {
    // Perform your submission logic here
    console.log("Data submitted:", jsonData);
    try {
      const response = await fetch("api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: jsonData }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Submission successful:", result);
        alert("Data submitted successfully!");
      } else {
        console.error("Submission failed:", response.statusText);
        alert("Failed to submit data.");
      }
    } catch (error) {
      console.error("Error during submission:", error);
      alert("An error occurred while submitting data.");
    }
  };

  // Handle Excel file upload and conversion
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(worksheet);
        setJsonData(json);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <Box backgroundColor={"black"} height={"100vh"} width="100vw" mx="auto" my={10} p={4} border="1px solid #E2E8F0" borderRadius="md">
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        Upload Excel File
      </Heading>
      <Input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        mb={4}
        p={2}
      />
      {jsonData.length > 0 && (
        <Box
          maxHeight="90vh"
          overflowY="auto"
          overflowX="auto"
          border="1px solid #E2E8F0"
          borderRadius="md"
          width="100%"
          mb={4}
        >
          <Table variant="unstyled" size="sm">
            <Thead>
              <Tr >
                {Object.keys(jsonData[0]).map((key) => (
                  <Th
                    key={key}
                    borderBottom="1px solid #E2E8F0"
                     border="1px solid #E2E8F0"
                    px={4}
                    py={2}
                    textAlign="left"
                    textColor="lightcyan"
                    fontSize="0.9vw"
                  >
                    {key}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody >
              {jsonData.map((row, index) => (
                <Tr key={index} borderBottom="1px solid #E2E8F0">
                  {Object.values(row).map((value, i) => (
                    <Td  border="1px solid #E2E8F0" key={i} px={4} py={2} textColor={"wheat"} textAlign="left">
                      {value}
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      <Button onClick={handleSubmit} colorScheme="green" mt={4}>
        Submit
      </Button>
    </Box>
  );
};

export default App3;
