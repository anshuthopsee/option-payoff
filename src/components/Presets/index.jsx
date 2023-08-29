import { memo, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CustomPresetsContext } from '../../Contexts/CustomPresetsContextProvider';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ShortStraddleSVG from './ShortStraddleSVG'
import ShortStrangleSVG from './ShortStrangleSVG';
import BullCallSpreadSVG from './BullCallSpreadSVG';
import BullPutSpreadSVG from './BullPutSpreadSVG';
import CustomSVG from './CustomSVG';

const Presets = memo(({ drawerView, toggleDrawer }) => {
  const { customPresets } = useContext(CustomPresetsContext);

  return (
    <Box sx={{ backgroundColor: "background.secondary", borderRadius: "5px" }}>
      <Box sx={
        { 
          display: "flex", 
          alignItems: "center", 
          height: "55px",
          width: "100%",
          pl: "15px", 
          pr: "5px",
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: "border.main",
        }
      }>
        <Typography variant={'body1'}>Presets</Typography>
        { 
          drawerView ?
            <IconButton 
              size="small"
              color="inherit"
              aria-label="close-menu"
              onClick={toggleDrawer(false)}
            >
              <CloseIcon/>
            </IconButton>
          : ""
        }
      </Box>
      <Box sx={{ display: "inline-flex", flexWrap: "wrap", width: "100%", columnGap: "10px", rowGap: "10px", py: "10px", px: "10px"}}>
        <ShortStraddleSVG/>
        <ShortStrangleSVG/>
        <BullCallSpreadSVG/>
        <BullPutSpreadSVG/>
        {customPresets.map((customPreset, i) => {
          return (
            <CustomSVG name={customPreset.name} key={customPreset.name} index={i}/>
          )
        })}
      </Box>
    </Box>
  );
});

export default Presets;