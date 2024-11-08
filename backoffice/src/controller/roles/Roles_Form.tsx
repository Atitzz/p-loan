
import { HttpContext, MainContext } from "@/context/Context";
import {
  Box,
  Button,
  Divider,
  InputLabel,
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
  version:'1.0',
  message:''
};
type errorDefault = {
    field:string,
    message:string
}[]
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import ConfirmDialog from "@/component/ConfirmDialog";

function Roles_Form() {
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
      Get(`system/roles/${id}`).then((response) => {
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
      Post(`system/roles`, {
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
      Put(`system/roles/${data.id}`, {
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
    Delete(`system/roles?id=${id}`, {})
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
        text={"กรุณากดยืนยันหากคุณต้องการจะลบสิทธิ์นี้"}
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
            ลบสิทธิ์
          </Button>
        )}
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {!id
              ? useLang("เพิ่มสิทธิ์", "Add New Roles")
              : useLang("ปรับปรุงสิทธิ์", "Edit Roles")}
          </Box>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
          <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ color: "#000" }}>
                {useLang("ชื่อสิทธิ์", "Roles Name")}
              </InputLabel>
          <TextField  fullWidth value={data['name']} name="name" onChange={onChange}/>
          </Box>
          </Stack>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
          <Box sx={{ flex: 1 }}>
          <InputLabel sx={{ color: "#000" }}>
                {useLang("คีย์สิทธิ์", "Roles Key")}
              </InputLabel>
          <TextField  fullWidth value={data['key']} name="key" onChange={onChange}/>
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
export default Roles_Form
