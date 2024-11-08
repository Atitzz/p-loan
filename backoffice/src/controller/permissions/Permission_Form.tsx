import { HttpContext, MainContext } from "@/context/Context";
import {
  Box,
  Button,
  Divider,
  InputLabel,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as Icons from "@mui/icons-material";
const defaultData = {
  id: -1,
  created_at: null,
  updated_at: null,
  deleted_at: null,
  key: "1.0",
  name: "",
  approve: "false",
  reject: "false",
  show: "false",
  list: "false",
  store: "false",
  update: "false",
  remove: "false",
  manage_users: "false",
};
type errorDefault = {
  field: string;
  message: string;
}[];
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import ConfirmDialog from "@/component/ConfirmDialog";

function Permission_Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  //   const { toDate, toTHB, toFloat } = useContext(ToolsContext);
  const [data, setData] = useState(defaultData);
  const [erros, setErrors] = useState<errorDefault>([]);
  const [method, setMethod] = useState("create");

  useEffect(() => {
    if (id) {
      setMethod("edit");
      Get(`system/permission/${id}`).then((response) => {
        setData(response.data.data);
      });
    } else {
      setMethod("create");
    }
  }, [id]);
  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = () => {
    if (method === "create") {
      Post(`system/permission`, {
        ...data,
      })
        .then((response) => {
          setData(response.data.data);
          AddAlert(MessageResponse(response), "info");
          navigate(-1);
        })
        .catch((error) => {
          AddAlert(ErrorResponse(error), "error");
          if (error?.response?.data) setErrors(error.response.data.data);
        });
    } else {
      Put(`system/permission/${data.id}`, {
        ...data,
      })
        .then((response) => {
          setData(response.data.data);
          AddAlert(MessageResponse(response), "info");
          navigate(-1);
        })
        .catch((error) => {
          AddAlert(ErrorResponse(error), "error");
          if (error?.response?.data) setErrors(error.response.data.data);
        });
    }
  };

  const [openDel, setOpenDel] = useState(false);
  const onDelete = () => {
    setOpenDel(true);
  };

  const deleteSubmit = () => {
    Delete(`system/permission?id=${id}`, {})
      .then((response) => {
        AddAlert(MessageResponse(response), "info");
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };
  return (
    <Stack spacing={2}>
      <ConfirmDialog
        open={openDel}
        onClose={() => setOpenDel(false)}
        onSubmit={deleteSubmit}
        text={"กรุณากดยืนยันหากคุณต้องการจะลบการเข้าถึงนี้"}
      />
      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button
          startIcon={<Icons.ArrowBackIos />}
          variant="contained"
          onClick={() => navigate(-1)}
        >
          ย้อนกลับ
        </Button>
        {id && (
          <Button
            startIcon={<Icons.Delete />}
            color="error"
            variant="contained"
            onClick={onDelete}
          >
            ลบการเข้าถึง
          </Button>
        )}
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {!id
              ? useLang("เพิ่มการเข้าถึง", "Add New Roles")
              : useLang("ปรับปรุงการเข้าถึง", "Edit Roles")}
          </Box>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("ชื่อการเข้าถึง", "Permission Name")}
              </InputLabel>
              <TextField
                fullWidth
                value={data["name"]}
                name="name"
                onChange={onChange}
              />
            </Box>
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("คีย์การเข้าถึง", "Permission Key")}
              </InputLabel>
              <TextField
                fullWidth
                value={data["key"]}
                name="key"
                onChange={onChange}
              />
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("อนุมัติ", "Approve")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["approve"]}
                name="approve"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("ปฏิเศษ", "Reject")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["reject"]}
                name="reject"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("แสดง", "Show")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["show"]}
                name="show"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("รายการ", "List")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["list"]}
                name="list"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("บันทึก", "Store")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["store"]}
                name="store"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("แก้ไข", "Update")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["update"]}
                name="update"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("ลบ", "Remove")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["remove"]}
                name="remove"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("จัดการผู้ใช้", "Manage Users")}
              </InputLabel>
              <TextField
                fullWidth
                select
                value={data["manage_users"]}
                name="manage_users"
                onChange={onChange}
              >
                <MenuItem value={"true"}>TRUE</MenuItem>
                <MenuItem value={"false"}>FALSE</MenuItem>
              </TextField>
            </Box>
          </Stack>

        </Stack>
      </Stack>

      <Button variant="contained" onClick={onSubmit}>
        บันทึก
      </Button>
    </Stack>
  );
}
export default Permission_Form;
