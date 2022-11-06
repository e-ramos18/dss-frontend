import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { IActor } from "../types";

type IProps = {
  options: IActor[];
  handleChange: (event: object, value: IActor[]) => void;
  helperText: string;
  defaultValue?: IActor[];
};

const SelectActor = ({
  options,
  handleChange,
  helperText,
  defaultValue = [],
}: IProps) => {
  return (
    <Autocomplete
      multiple
      id="tags-outlined"
      options={options}
      getOptionLabel={(option: IActor) => `${option.fname} ${option.lname}`}
      filterSelectedOptions
      onChange={handleChange}
      defaultValue={defaultValue}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Select Actor"
          placeholder="Select Actor"
          helperText={helperText}
          error={helperText !== ""}
        />
      )}
    />
  );
};

export default SelectActor;
