import { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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
import { getSelectedStrategyLegs, updateStrategyLegs } from '../../features/selected/selectedSlice';

export default function LegsWindow({ legs }) {

  const dispatch = useDispatch();

  const selectedStrategyLegs = useSelector(getSelectedStrategyLegs);

  const selectionModel = useMemo(() => {
    return selectedStrategyLegs.filter(leg => leg.selected).map(leg => leg.id);
  }, [selectedStrategyLegs]);

  const [rowModesModel, setRowModesModel] = useState({});
  
  const handleDeleteClick = (id) => (e) => {
    e.stopPropagation(); 
    const updatedLegs = selectedStrategyLegs.filter((row) => row.id !== id);
    dispatch(updateStrategyLegs(updatedLegs));
  };

  const handleRowSelectedModelChange = (newSelectionModel) => {
    const deepCopyLegs = JSON.parse(JSON.stringify(selectedStrategyLegs));
  
    const updatedLegs = deepCopyLegs.map((leg) => {
      leg.selected = newSelectionModel.includes(leg.id);
      return leg;
    });
  
    dispatch(updateStrategyLegs(updatedLegs));
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

    const editedRow = selectedStrategyLegs.find((row) => row.id === id);
    if (editedRow.isNew) {
      dispatch(updateStrategyLegs(selectedStrategyLegs.filter((row) => row.id !== id)));
    };
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    dispatch(updateStrategyLegs(selectedStrategyLegs.map((row) => (row.id === newRow.id ? updatedRow : row))));
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
        rows={selectedStrategyLegs}
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