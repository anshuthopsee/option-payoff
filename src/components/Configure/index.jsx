import React, { useContext } from 'react'
import LegsWindow from './LegsWindow';
import Box from '@mui/material/Box';
import Header from './Header';
import AddLegs from './AddLegs'
import { StrategyContext } from '../../Contexts/StrategyContextProvider';

const Configure = React.memo(({ darkMode }) => {
  const { legs } = useContext(StrategyContext);

  return (
    <Box sx={
      {
        height: "100%", 
        backgroundColor: "background.secondary",
        display: "flex",
        minWidth: "290px",
        flexDirection: "column",
        borderRadius: "5px"
      }
    }>
      <Header/>
      <AddLegs darkMode={darkMode}/>
      <Box sx={{ display: "flex", flex: "auto", flexDirection: "column" }}>
        <Box sx={
          { 
            height: "400px",
            mt: "5px",
          }
        }>
          <LegsWindow legs={legs}/>
        </Box>
      </Box>
      {/* <AddRemoveModal open={modalIsOpen} closeModal={closeModal}/> */}
    </Box>
  );
});

export default Configure;