import React, { useState } from "react";
import Form from "@rjsf/core";
import validator from "@rjsf/validator-ajv8";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import schema from "./loanSchema.json";

const LoanApplicationForm = () => {
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = ({ formData }) => {
    console.log("Submitted Data:", formData);
    toast.success("Application Submitted Successfully!");
    setSubmitted(true);
  };

  const handleError = (errors) => {
    console.log("Errors:", errors);
    toast.error("Please fix validation errors!");
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
      <h2 className="text-center mb-4">Loan Application</h2>

      <div className="card shadow p-4 w-100" style={{ maxWidth: "600px" }}>
        <Form
          schema={schema}
          validator={validator}
          formData={formData}
          onChange={({ formData }) => setFormData(formData)}
          onSubmit={handleSubmit}
          onError={handleError}
          className="needs-validation"
          uiSchema={{
            "ui:submitButtonOptions": {
              "norender": false,
              "submitText": "Apply Now",
              "props": { className: "btn btn-primary w-100" }
            }
          }}
        />
      </div>

      {submitted && (
        <div className="alert alert-success mt-3 text-center">
          ✅ Application Successfully Submitted!
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoanApplicationForm;
