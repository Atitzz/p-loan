import { icon } from "@/_layout/json/icon";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import ConfirmDialog from "@/component/ConfirmDialog";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import * as Icons from "@mui/icons-material";
import { Link } from "react-router-dom";
const defaultInput = {
  id: -1,
  name: "",
  name_th: "",
  path: "",
  link: "",
  type: "sidebar",
  index: -1,
  icon: "Circle",
  component: "404",
  details: "",
};

function Sidebar_Route() {
  const { AddAlert, component, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const {} = useContext(ToolsContext);

  const [title, setTitle] = useState("Create");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 25,
  });
  const [data, setData] = useState([]);
  const [input, setInput] = useState(defaultInput);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Get(`route?search=${search}&page=${page}&limit=${pageSize}`)
      .then((response) => {
        setData(response.data.data);
        setPages(response.data.pages);
        setTimeout(()=>{
          setIsLoading(false);
        },250)
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [page, search, pageSize]);

  const [open, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);
  const submitDialog = () => {};
  const onCreate = () => {
    setInput(defaultInput);
    setTitle("Create");
    setOpen(true);
  };
  const onUpdate = (id: number) => {
    const existItem = data.find((x) => x.id == id);
    if (!existItem) {
      AddAlert("not found item!", "warning");
    }

    setTitle("Update");
    setInput(existItem);
    setOpen(true);
  };
  const [deleteid, setDeleteId] = useState(-1);
  const onDelete = (id: number) => {
    setDeleteId(id);
    setConfirm(true);
  };

  const submitDeleted = () => {
    Delete(`route`, { id: deleteid })
      .then((response) => {
        setData((prev) => prev.filter((x) => x.id != deleteid));
        AddAlert(MessageResponse(response));
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  };
  const onChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = () => {
    if (input.id !== -1) {
      Put(`route`, input)
        .then((response) => {
          setData((prev) => {
            return prev.map((x) => {
              if (x.id !== response.data.data.id) return x;
              return response.data.data;
            });
          });
          AddAlert(MessageResponse(response));
        })
        .catch((err) => AddAlert(ErrorResponse(err), "error"));
    } else {
      Post(`route`, input)
        .then((response) => {
          setData((prev) => [response.data.data, ...prev]);
          AddAlert(MessageResponse(response));
        })
        .catch((err) => AddAlert(ErrorResponse(err), "error"));
    }
    closeDialog();
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "index",
      headerName: "S.N.",
      width: 75,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              textAlign: "start",
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <Box component="span">{params.row.name}</Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              {params.row.name_th}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "path",
      headerName: "Path",
      headerAlign: "center",
      width: 200,
      align:"center",
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="span">{params.row.path}</Box>
            <Box
              component={Link}
              to={params.row.link}
              sx={{ color: "#0d6efd" }}
            >
              {params.row.link}
            </Box>
          </Box>
        );
      },
    },
    {
      field: "component",
      headerName: "Component",
      width: 150,
      headerAlign: "center",
      align:"center",
      renderCell: (params) => {
        return (
          <Box
            component="button"
            sx={{
              bgcolor: "transparent",
              border: 0,
              display: "flex",
              flexDirection: "column",
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component="span">{params.row.component}</Box>
            <Box component="span" sx={{ color: "#0d6efd" }}>
              {params.row.type}
            </Box>
          </Box>
        );
      },
    },

    { field: "details", headerName: "Details", flex: 1,headerAlign: "center",align:"center"},
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 250,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => onUpdate(Number(id))}
            startIcon={<Icons.Edit />}
          >
            Edit
          </Button>,
          <Button
            variant="outlined"
            startIcon={<Icons.VisibilityOff />}
            color="error"
            sx={{ gap: 2 }}
            onClick={() => onDelete(Number(id))}
          >
            Delete
          </Button>,
        ];
      },
    },
  ];
  return (
    <React.Fragment>
      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onSubmit={submitDeleted}
      />
      <GridRender
        isLoading={isLoading}
        title={useLang("เส้นทาง", "Route")}
        columns={columns}
        rows={data}
        insertEnd={
          <Button
            variant="contained"
            startIcon={<Icons.Add />}
            onClick={onCreate}
          >
            {useLang("เพิ่มใหม่", "Add New")}
          </Button>
        }
        thisPage={setPage}
        onSearchText={setSearch}
        pages={pages}
        pageSize={setPageSize}
      />
      <Dialog open={open} onClose={closeDialog} onSubmit={submitDialog}>
        <DialogContent>
          <InputLabel sx={{ textAlign: "center" }}>{title}</InputLabel>
          <Stack spacing={2}>
            <TextField
              size="small"
              name="name"
              value={input.name}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Name</InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              name="name_th"
              value={input.name_th}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Name TH</InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              name="path"
              value={input.path}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Path</InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              name="link"
              value={input.link}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Link</InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              name="index"
              value={input.index}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Index</InputAdornment>
                ),
              }}
            />
            <TextField
              select
              size="small"
              name="type"
              value={input.type}
              onChange={onChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">Type</InputAdornment>
                ),
              }}
            >
              <MenuItem value={"sidebar"}>Sidebar</MenuItem>
              <MenuItem value={"route"}>Route</MenuItem>
            </TextField>
            <Select
              size="small"
              name="component"
              value={input.component}
              onChange={onChange}
            >
              <MenuItem value={"none"} sx={{ display: "none" }}>
                Route Component
              </MenuItem>
              {component.map((value, i) => (
                <MenuItem key={`component-${i}`} value={value}>
                  <Stack direction="row" alignItems="center">
                    {value}
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            <Select
              size="small"
              name="icon"
              value={input.icon}
              onChange={onChange}
            >
              <MenuItem value={"none"} sx={{ display: "none" }}>
                Icon
              </MenuItem>
              {Object.entries(icon).map(([key, value], i) => (
                <MenuItem key={`icon-${i}`} value={key}>
                  <Stack direction="row" justifyContent="center">
                    {value}
                  </Stack>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <InputLabel>{key}</InputLabel>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              name="details"
              value={input.details}
              onChange={onChange}
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    Route Details
                  </InputAdornment>
                ),
              }}
            />
            <Button variant="contained" onClick={onSubmit}>
              Submit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}

export default Sidebar_Route;
