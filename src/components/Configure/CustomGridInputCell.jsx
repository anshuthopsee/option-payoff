import { GridEditInputCell } from "@mui/x-data-grid"

const CustomGridInputCell = ({ params, isInEditMode }) => {
  return (
    <>
      {
        isInEditMode ? 
          <GridEditInputCell 
            {...params} 
            inputProps={{
              max: 99999,
              min: 0,
              maxLength: 5,
              onInput: (e) => e.target.value = e.target.value.slice(0, 4)
            }}
          /> 
            :
          <div>{params.value}</div>
      }
    </>
  );
}

export default CustomGridInputCell