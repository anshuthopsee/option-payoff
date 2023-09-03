import { GridEditInputCell } from "@mui/x-data-grid"

const CustomGridInputCell = ({ params, isInEditMode }) => {

  const handleInput = (e) => {
    const { value } = e.target;

    if (value === '') {
      e.target.value = 0;
    };
  
    if (value.charAt(0) === '0' && value.length > 1 && value.charAt(1) !== '.') {
      const updatedValue = value.slice(1);
      e.target.value = updatedValue;
    };

    const numericValue = parseFloat(value);

    if (numericValue >= 10000) {
      const updatedValue = value.slice(0, -1);
      e.target.value = updatedValue;
    };
  
    if (numericValue < 0.1 && value.includes('.')) {
      const [integer, decimal] = value.split('.');
      if (decimal.length > 0) {
        const updatedValue = e.target.value.slice(0, 1);
        e.target.value = updatedValue;
      };
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
};

export default CustomGridInputCell;