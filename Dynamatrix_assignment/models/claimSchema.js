import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  companyReference: String,
  policyNumber: String,
  partnerRef: String,
  incidentDate: Date,
  accidentCircumstances: String,
  damageToVehicle: String,
  preExistingDamage: String,
  registrationNumber: String,
  make: String,
  model: String,
  engineSize: String,
  registrationDate: Date,
  thirdParty: {
    insurer: String,
    reference: String,
    client: String,
    registration: String
  },
  driver: {
    firstName: String,
    lastName: String,
    title: String,
    address: {
      line1: String,
      postcode: String
    },
    contact: {
      homeTelephone: String,
      workTelephone: String,
      mobileTelephone: String,
      email: String
    }
  },
  repairDetails: {
    repairerName: String,
    repairerContact: {
      telephone: String,
      email: String
    },
    bookingInDate: Date,
    estimatedCompletionDate: Date,
    repairCost: {
      net: Number,
      vat: Number,
      gross: Number
    }
  },
  salvage: {
    amount: Number,
    category: String,
    agentName: String,
    clearedDate: Date
  },
  financials: {
    pav: Number,
    salvageValuePaid: Number,
    invoiceReceivedDate: Date,
    invoiceApprovedDate: Date
  },
  status: String
});

const Claim = mongoose.model("Claim", claimSchema);
export default Claim;

