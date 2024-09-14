import { Student } from "../models/student.js";


export const addUser = async(req,res)=>{
    const {name,email,age,course} = req.body;

    try {
        const student = new Student({ name, email, age, course });
    await student.save();
    res.status(201).json({ msg: 'Student added successfully', student });
    } catch (error) {
        console.error(error);
    res.status(500).json({ msg: 'Server error' });
    }
}

// Edit student
export const editStudent = async (req, res) => {
    const { name, email, age, course } = req.body;
  
    try {
      let student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ msg: 'Student not found' });
      }
  
      student = await Student.findByIdAndUpdate(req.params.id, { name, email, age, course }, { new: true });
      res.json({ msg: 'Student updated successfully', student });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  };
  
  // Delete student
  export const deleteStudent = async (req, res) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ msg: 'Student not found' });
      }
  
      await student.deleteOne();
      res.json({ msg: 'Student deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Server error' });
    }
  };