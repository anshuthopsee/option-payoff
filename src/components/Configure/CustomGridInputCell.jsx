import { GridEditInputCell } from "@mui/x-data-grid"

const CustomGridInputCell = ({ params, isInEditMode }) => {

  const handleInput = (e) => {
    const { value } = e.target;

    if (e.target.value === '') {
      e.target.value = 0;
    };
  
    if (value.charAt(0) === '0' && value.length > 1 && value.charAt(1) !== '.') {
      const updatedValue = value.slice(1);
      e.target.value = updatedValue;
    };

    if (parseFloat(value) >= 10000) {
      const updatedValue = value.slice(0, -1);
      e.target.value = updatedValue;
    };
  
    if (parseFloat(value) < 0.1 && value.includes('.')) {
      const [integerPart, decimalPart] = value.split('.');
      if (decimalPart.length > 1) {
        const updatedValue = `${integerPart}.${decimalPart.slice(0, 1)}`;
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