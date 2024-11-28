import React, { useState, useEffect, useRef, useCallback } from "react";

const App = () => {
  const [data, setData] = useState([]);
  const [visibleCells, setVisibleCells] = useState(15); // Controls the number of visible cells initially
  const [loader, setLoader] = useState(false); //It is use for fetch all data again after upload data.
  const fileInputRef = useRef(null); //Empty the input after submit

  const totalCells = data.length; // Total cells based on data
  const observer = useRef(); // Ref for IntersectionObserver
  const [input, setInput] = useState(null);

  useEffect(() => {
    async function fetchData() {
      // try {
      //   const response = await fetch("/api/getData");
      //   const datas = await response.json();
      //   setData([...datas.data]);
      // } catch (error) {
      //   console.log(error, "error on fetching data");
      // }
    }
    fetchData();
  }, [loader]);

  //Handle to submit the form...
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("file", input);
    if (!input) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Form submmited sucessfully");
        setInput(null);
        fileInputRef.current.value = "";
        setLoader((prev) => !prev);
      } else {
        alert("File upload failed!");
      }
    } catch (error) {
      console.log(error, "Error form uploads");
    }
  };

  //Handle file input type check...
  const handleFile = (e) => {
    const acceptFile = ["xlsx"];
    const fileInput = e.target;
    const seletedFile = fileInput.files[0];

    if (seletedFile) {
      const selectedFiletype = seletedFile.name.split(".").pop().toLowerCase();
      if (acceptFile.includes(selectedFiletype)) {
        setInput(seletedFile);
      } else {
        alert("It only accept .xlsx file");
        fileInput.value = "";
        return;
      }
    }
  };

  //Load the table headers
  let headers;
  if (data.length > 0) {
    headers = Object.keys(data[0]);
  }

  // Infinite scroll observer
  const lastCellRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect(); //Clear before create new instance
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && visibleCells < totalCells) {
          setVisibleCells((prev) => prev + 15); // Load 15 more cells when the last cell is visible
        }
      });
      if (node) observer.current.observe(node);
    },
    [visibleCells, totalCells]
  );

  return (
    <div className="min-h-screen flex flex-col p-4">
      <input ref={fileInputRef} type="file" onChange={handleFile} />
      <button
        className="px-3 py-2 bg-green-400 rounded-lg w-24 m-4"
        type="submit"
        onClick={handleSubmit}
      >
        Submit
      </button>
      <h1 className="flex justify-center p-8 text-2xl font-semibold">
        Employee Data Grid
      </h1>
      <div className="grid gap-4 p-4 grid-cols-3">
        {/* Render the headers */}
        {headers &&
          headers.map((elem, index) => (
            <div
              key={index}
              className="font-bold bg-gray-200 p-2 text-center border sticky top-0 border-gray-300"
            >
              {elem.replace("_", " ")}
            </div>
          ))}

        {/* Render the data */}
        {data.slice(0, visibleCells).map((elem, index) => {
          const isLastCell = index + 1 === visibleCells;
          return (
            <React.Fragment key={index}>
              <div
                key={`${elem.SL_NO}-${index}-sl`}
                className="p-2 text-center border border-gray-300"
                ref={isLastCell ? lastCellRef : null} // Attach ref to the last cell for observer
              >
                {elem.SL_NO}
              </div>
              <div
                key={`${elem.SL_NO}-${index}-vc`}
                className="p-2 text-center border border-gray-300"
              >
                {elem.VILLAGE_COLLECTION}
              </div>
              <div
                key={`${elem.SL_NO}-${index}-amt`}
                className="p-2 text-center border border-gray-300"
              >
                {elem.AMOUNT}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default App;
