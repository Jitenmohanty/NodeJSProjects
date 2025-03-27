# Loan Application Form

## Overview
This project provides a **Loan Application Form** built using React and JSON Schema Form. It allows users to input business details, loan requirements, and dynamically adds guarantor information if the credit score is below 700.

## Features
- **Business Details**
  - Business Name
  - GSTIN (validated format)
  - Business Address
  - List of Directors (with PAN validation and role selection)

- **Loan Details**
  - Credit Score (validated range: 0-900)
  - Loan Amount (slider between 50,000 - 5,00,000)
  - Loan Purpose

- **Conditional Fields**
  - If **Credit Score < 700**:
    - Requires at least **two guarantors** with PAN validation
    - Upload of **bank statement**

## Technologies Used
- **React.js** - Frontend framework
- **@rjsf/core** - JSON Schema Form for form generation
- **Bootstrap** - Styling and layout
- **React Toastify** - Notifications
- **AJV Validator** - JSON schema validation

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/loan-application.git [`You can't clone it's a public repo.....`]
   cd loan-application
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm start
   ```

## Usage
- Fill in the business details.
- Enter the loan details (Credit Score, Loan Amount, Purpose of Loan).
- If credit score is below 700, provide at least **two guarantors** and upload a **bank statement**.
- Click "Apply Now" to submit.

## Validation Rules
- **GSTIN**: Must follow proper GSTIN format (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[Z]{1}[0-9]{1}$`)
- **PAN Number**: Must follow proper PAN format (`^[A-Z]{5}[0-9]{4}[A-Z]{1}$`)
- **Loan Amount**: Between **₹50,000 and ₹5,00,000**
- **Guarantors**: Required if credit score is below 700
- **Bank Statement**: Mandatory file upload if credit score is below 700

## Folder Structure
```
loan-application/
│── src/
│   ├── components/
│   │   ├── LoanApplicationForm.js  # Main form component
│   │   ├── loanSchema.json         # JSON Schema for form validation
│   ├── App.js
│   ├── index.js
│── public/
│── package.json
│── README.md
```

## License
This project is licensed under the **MIT License**.

## Contributors
- **Your Name** - Developer

## Future Enhancements
- API integration for loan submission
- Multi-step form for better UX
- Backend validation with a database

For any suggestions or contributions, feel free to create an issue or pull request! 🚀

