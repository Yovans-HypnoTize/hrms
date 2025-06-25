import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React from "react";
import { ProjectConfig, rowPerPageOptions } from "../common/Constants";

interface MuiPaginationSelectProps {
  handleRowPerPageChange: (value : any) => void;
  setCurrentPage: (value:any) => void;
  key:any
}

const MuiPaginationSelect:React.FC<MuiPaginationSelectProps> = ({handleRowPerPageChange, setCurrentPage,key}) => {
  const [value, setValue] = React.useState(`${ProjectConfig.EntriesPerPage}`);

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string);
    handleRowPerPageChange(event.target.value as string)
    setCurrentPage(1)
  };

  
  return (
    <Select
      value={value}
      onChange={handleChange}
      displayEmpty
      inputProps={{ "aria-label": "Without label" }}
      sx={{ mx: 2, height: 32, width: 80, fontSize: "0.875rem" }}
      key={key}
    >
      {rowPerPageOptions.map((item) => (
        <MenuItem value={item}>{item}</MenuItem>
      ))}
    </Select>
  );
};

export default MuiPaginationSelect;
