import TableRender from "@/component/TableRender";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Button,
  Dialog,
  DialogContent,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
} from "@mui/material";
import { DataGrid, GridActionsCellItem, GridColDef } from "@mui/x-data-grid";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
import GridRender from "@/component/GridRender";
const defaultInput = {
  id: -1,
  name: "",
  description: "",
};

function PlansCategories() {
  //   const { status } = useParams();
  const { AddAlert, component, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const {} = useContext(ToolsContext);
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 20,
  });
  const [data, setData] = useState([]);
  useEffect(() => {
    setPage(1);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    Get(`category?search=${search}&page=${page}&limit=${pageSize}`)
      .then((response) => {
        setData(response.data.data);
        setPages(response.data.pages);
        setTimeout(()=>{
          setIsLoading(false);
        },250)
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [page, search, pageSize]);

  const viewDetails = (id) => {
    const __route = dataRoute.find((x) => x.component == "loans_details");
    navigate(`${__route.link}/${id}`);
  };

  const viewInstallment = (id) => {
    const __route = dataRoute.find((x) => x.component == "loans_installments");
    navigate(`${__route.link}/${id}`);
  };

  const onCreate = () => {
    setTitle(useLang("สร้างใหม่", "Add New"));
    setOpen(true);
    setInput(defaultInput);
  };

  const onEdit = (id) => {
    setTitle(useLang("ปรับปรุง", "Edit"));
    setOpen(true);
    const __existItem = data.find((x) => x.id === id);
    if (!__existItem)
      return AddAlert(useLang("ไม่พบรายการนี้", "Not Found Items"), "warning");
    setInput(__existItem);
  };

  const [title, setTitle] = useState(useLang("สร้างใหม่", "Add New"));
  const [input, setInput] = useState(defaultInput);
  const [open, setOpen] = useState(false);
  const closeDialog = () => setOpen(false);
  const submitDialog = () => {
    if (title === useLang("สร้างใหม่", "Add New")) {
      Post("category/create", input)
        .then((response) => {
          setData((prev) => [...prev, response.data.data]);
          AddAlert(MessageResponse(response), "success");
          closeDialog();
        })
        .catch((err) => AddAlert(ErrorResponse(err), "error"));
    } else {
      Put(`category/update/${input.id}`, input)
        .then((response) => {
          setData((prev) =>
            prev.map((item) =>
              item.id === input.id ? response.data.data : item
            )
          );
          AddAlert(MessageResponse(response), "success");
          closeDialog();
        })
        .catch((err) => AddAlert(ErrorResponse(err), "error"));
    }
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

  const columns: GridColDef<(typeof data)[number]>[] = [
    { field: "id", headerName: "S.N.", width: 90 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "description", headerName: "Description", flex: 1 },
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
            onClick={() => onEdit(id)}
          >
            <Icons.Edit />
            Edit
          </Button>,
          <Button variant="outlined" color="error" sx={{ gap: 2 }}>
            <Icons.VisibilityOff />
            Delete
          </Button>,
        ];
      },
    },
  ];
  return (
    <Stack gap={4}>
      <GridRender
        isLoading={isLoading}
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
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={closeDialog}
        onSubmit={submitDialog}
      >
        <DialogContent>
          <InputLabel sx={{ textAlign: "center" }}>{title}</InputLabel>
          <Stack spacing={2}>
            <TextField
              size="small"
              name="name"
              value={input.name}
              onChange={onChange}
              placeholder="Name"
            />

            <TextField
              size="small"
              name="description"
              value={input.description}
              onChange={onChange}
              multiline
              rows={4}
              placeholder="Description"
            />
            <Button variant="contained" onClick={submitDialog}>
              Submit
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>
    </Stack>
  );
}

export default PlansCategories;
