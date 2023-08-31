import { GridEditInputCell } from "@mui/x-data-grid"

const CustomGridInputCell = ({ params, isInEditMode }) => {

  const handleInput = (e) => {
    if (e.target.value === "") {
      e.target.value = 0;
    };

    if (parseFloat(e.target.value) >= 10000) {
      e.target.value = Math.floor(Number(e.target.value)/10);
    };
  };

  return (
    <>
      {
        isInEditMode ? 
          <GridEditInputCell 
            {...params} 
            inputProps={{
              max: 9999,
              min: 0,
              onInput: handleInput
            }}
          /> 
            :
          <div>{Number(params.value)}</div>
        }
    </>
  );
}

export default CustomGridInputCell;