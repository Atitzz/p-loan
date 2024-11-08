import RichText from "@/component/RichText";
import Switch from "@/component/Switch";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
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

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import ConfirmDialog from "@/component/ConfirmDialog";

function Policy_Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
//   const { toDate, toTHB, toFloat } = useContext(ToolsContext);
  const [data, setData] = useState(defaultData);
  const [erros, setErrors] = useState([]);
  const [method, setMethod] = useState("create");

  useEffect(() => {
    if (id) {
      setMethod("edit");
      Get(`policy/${id}`).then((response) => {
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
      Post(`policy`, {
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
      Put(`policy/${data.id}`, {
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
    Delete(`policy?id=${id}`, {})
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
        text={"กรุณากดยืนยันหากคุณต้องการจะลบนโยบายนี้"}
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
            ลบนโยบาย
          </Button>
        )}
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {!id
              ? useLang("เพิ่มนโยบาย", "Add New Privacy")
              : useLang("ปรับปรุงนโยบาย", "Edit Privacy")}
          </Box>
          <Divider />
          <TextField value={data['version']} name="version" onChange={onChange}/>
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "#000" }}>
                {useLang("นโยบาย", "Policy")}
              </InputLabel>
              <ReactQuill
                value={data["message"]}
                onChange={(value) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      message: value,
                    };
                  });
                }}
              />
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

export default Policy_Form;
