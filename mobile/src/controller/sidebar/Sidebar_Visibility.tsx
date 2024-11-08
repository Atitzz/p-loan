import {
  Box,
  Button,
  Chip,
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
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import { icon } from "@/_layout/json/icon";
import ConfirmDialog from "@/component/ConfirmDialog";
import TableRender from "@/component/TableRender";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
const defaultInput = {
  id: -1,
  index: "",
  name: "",
  name_th: "",
  icon: "none",
  details: "none",
  route: [],
  permissions: [],
};
function Sidebar_Visibility() {
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const {} = useContext(ToolsContext);
  const [title, setTitle] = useState("Create");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize,setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 25,
  });
  const [route, setRoute] = useState([]);
  const [permissions, setpermissions] = useState([]);
  const [input, setInput] = useState(defaultInput);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    Get(`route?search=&page=${page}&limit=1000`)
      .then((response) => {
        setRoute(response.data.data);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));

    Get(`system/permission?search=&page=${page}&limit=1000`)
      .then((response) => {
        setpermissions(response.data.data);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Get(`menu?search=${search}&page=${page}&limit=20`)
      .then((response) => {
        setData(response.data.data);
        setPages(response.data.pages);
        setTimeout(()=>{
          setIsLoading(false);
        },250)
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [page, search]);
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
    const setData = {
      ...existItem,
      permissions: existItem.permissions.map((x) => x.name) || [],
      route: existItem.route.map((x) => x.name) || [],
    };
    setTitle("Update");
    setInput(setData);
    setOpen(true);
  };
  const [deleteid, setDeleteId] = useState(-1);
  const onDelete = (id: number) => {
    setDeleteId(id);
    setConfirm(true);
  };

  const submitDeleted = () => {
    Delete(`menu`, { id: deleteid })
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
    const send = {
      ...input,
      permissions: input.permissions.map((x) =>
        permissions.find((d) => d.name == x)
      ),
      route: input.route.map((x) => route.find((d) => d.name == x)),
    };
    if (input.id !== -1) {
      Put(`menu`, send)
        .then((response) => {
          AddAlert(MessageResponse(response));
          setData((prev) => {
            return prev.map((x) => {
              if (x.id !== response.data.data.id) return x;
              return response.data.data;
            });
          });
        })
        .catch((err) => AddAlert(ErrorResponse(err), "error"));
    } else {
      Post(`menu`, send)
        .then((response) => {
          AddAlert(MessageResponse(response));
          setData((prev) => [response.data.data, ...prev]);
        })
        .catch((err) => AddAlert(ErrorResponse(err), "error"));
    }
    closeDialog();
  };

  const headers = [
    {
      title: "Index",
      key: "index",
      width: "75px",

      align: "center",
    },
    {
      title: "Name",
      key: "name",
    },
    {
      title: "NameTH",
      key: "name_th",
    },
    {
      title: "Details",
      key: "details",
    },
    {
      title: "Action",
      key: "id",
      width: "200px",
      type: "action",
      align: "center",
      action: [
        { func: onUpdate, name: "Update" },
        {
          func: onDelete,
          name: "Delete",
        },
      ],
    },
  ];

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
    { field: "details", headerName: "Details", flex: 1 },
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
            color="error"
            sx={{ gap: 2 }}
            startIcon={<Icons.VisibilityOff />}
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
        title={useLang("การมองเห็น", "Visibility")}
        columns={columns}
        rows={data}
        insertEnd={
          <Button variant="contained" startIcon={<Icons.Add/>} onClick={onCreate}>
          {useLang( "เพิ่มใหม่","Add New")}
         </Button>
        }
        thisPage={setPage}
        pageSize={setPageSize}
        onSearchText={setSearch}
        pages={pages}
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
                  <InputAdornment position="start">Menu Name</InputAdornment>
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
                  <InputAdornment position="start">Menu Name</InputAdornment>
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
                  <InputAdornment position="start">Menu Index</InputAdornment>
                ),
              }}
            />
            <InputLabel>Icon</InputLabel>
            <Select
              size="small"
              name="icon"
              value={input.icon}
              onChange={onChange}
            >
              <MenuItem value={"none"} sx={{ display: "none" }}>
                Menu Icon
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
            <InputLabel>Route</InputLabel>
            <Select
              size="small"
              name="route"
              value={input.route}
              onChange={onChange}
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {route.map((value, i) => (
                <MenuItem key={`route-${i}`} value={value.name}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <InputLabel>{value.name}</InputLabel>
                  </Stack>
                </MenuItem>
              ))}
            </Select>
            <InputLabel>Permissions</InputLabel>
            <Select
              size="small"
              name="permissions"
              value={input.permissions}
              onChange={onChange}
              multiple
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
            >
              {permissions.map((value, i) => (
                <MenuItem key={`permissions-${i}`} value={value.name}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <InputLabel>{value.name}</InputLabel>
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
                    Component Details
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

export default Sidebar_Visibility;
