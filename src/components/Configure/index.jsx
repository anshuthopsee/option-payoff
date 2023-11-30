import React, { useContext } from 'react'
import { useSelector } from 'react-redux';
import LegsWindow from './LegsWindow';
import Box from '@mui/material/Box';
import Header from './Header';
import AddLegs from './AddLegs';

const Configure = React.memo(({ darkMode }) => {

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
          <LegsWindow/>
        </Box>
      </Box>
      {/* <AddRemoveModal open={modalIsOpen} closeModal={closeModal}/> */}
    </Box>
  );
});

export default Configure;