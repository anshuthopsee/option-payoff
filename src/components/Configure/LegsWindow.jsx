import { useState, useContext, useMemo } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  GridRowEditStopReasons,
} from '@mui/x-data-grid';
import CustomGridInputCell from './CustomGridInputCell';
import NoLegsOverlay from './NoLegsOverlay';
import { StrategyContext } from '../../Contexts/StrategyContextProvider';

export default function LegsWindow({ legs }) {

  const { updateLegs } = useContext(StrategyContext);

  const selectionModel = useMemo(() => {
    return legs.filter(leg => leg.selected).map(leg => leg.id);
  }, [legs]);

  const [rowModesModel, setRowModesModel] = useState({});
  
  const handleDeleteClick = (id) => (e) => {
    e.stopPropagation(); 
    const updatedLegs = legs.filter((row) => row.id !== id);
    updateLegs(updatedLegs);
  };

  const handleRowSelectedModelChange = (newSelectionModel) => {
    const deepCopyLegs = JSON.parse(JSON.stringify(legs));
  
    const updatedLegs = deepCopyLegs.map((leg) => {
      leg.selected = newSelectionModel.includes(leg.id);
      return leg;
    });
  
    updateLegs(updatedLegs);
  };

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = legs.find((row) => row.id === id);
    if (editedRow.isNew) {
      updateLegs(legs.filter((row) => row.id !== id));
    };
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    updateLegs(legs.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
  };

  const customLocaleText = {
    footerRowSelected: count => `${count} ${count === 1 ? "leg" : "legs"} selected`
  };

  const columns = [
    {
      field: 'action',
      headerName: 'Action',
      sortable: false,
      type: 'singleSelect',
      align: 'center',
      headerAlign: 'center',
      flex: 0.15,
      editable: true,
      valueOptions: ['Buy', 'Sell'],
    },
    {
      field: 'strike',
      headerName: 'Strike',
      headerAlign: 'center',
      type: 'number',
      align: 'center',
      sortable: false,
      flex: 0.15,
      editable: true,
      renderEditCell: (params) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
        return (
          <CustomGridInputCell
            params={params}
            isInEditMode={isInEditMode}
          />
        );
      }
    },
    {
      field: 'premium',
      headerName: 'Premium',
      headerAlign: 'center',
      type: 'number',
      align: 'center',
      sortable: false,
      flex: 0.15,
      editable: true,
      renderEditCell: (params) => {
        const isInEditMode = rowModesModel[params.id]?.mode === GridRowModes.Edit;
        return (
          <CustomGridInputCell
            params={params}
            isInEditMode={isInEditMode}
          />
        );
      }
    },
    {
      field: 'type',
      headerName: 'Type',
      type: 'singleSelect',
      headerAlign: 'center',
      align: 'center',
      sortable: false,
      flex: 0.15,
      editable: true,
      valueOptions: ['PE', 'CE'],
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: '',
      flex: 0.15,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: 'primary.main',
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        checkboxSelection
        rows={legs}
        columns={columns}
        disableRowSelectionOnClick
        editMode="row"
        disableColumnMenu
        rowSelectionModel={selectionModel}
        onRowSelectionModelChange={handleRowSelectedModelChange}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        localeText={customLocaleText}
        autoPageSize
        slots={{
          noRowsOverlay: NoLegsOverlay,
        }}
        sx={{ 
          border: "none"
        }}
      />
    </div>
  );
};