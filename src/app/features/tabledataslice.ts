import { createSlice } from '@reduxjs/toolkit';

const initialState = [
  { id: 1, name: "Shivam", email: "shivamt0099@mail.com", age: 28, role: "Admin", department: "IT", location: "Delhi" },
  
];

const tableDataSlice = createSlice({
  name: 'tableData',
  initialState,
  reducers: {
    setTableData: (state, action) => action.payload
  }
});

export const { setTableData } = tableDataSlice.actions;
export default tableDataSlice.reducer;
