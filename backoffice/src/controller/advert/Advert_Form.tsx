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
  title: '',
  description: null,
  images: null
};

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import ConfirmDialog from "@/component/ConfirmDialog";

function Advert_Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
    useContext(HttpContext);
  const [data, setData] = useState(defaultData);
  const [errors, setErrors] = useState([]);
  const [method, setMethod] = useState("create");
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [showDeleteImageConfirm, setShowDeleteImageConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      setMethod("edit");
      Get(`advert/${id}`).then((response) => {
        setData(response.data.data);
        if (response.data.data.images) {
          setImageUrl(`${import.meta.env.VITE_BASE}/file/${response.data.data.images}`);
        }
      });
    } else {
      setMethod("create");
    }
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = () => {
    const formData = new FormData();
    if (data.title !== defaultData.title) {
      formData.append('title', data.title);
    }
    if (data.description !== defaultData.description) {
      formData.append('description', data.description);
    }

    if (imageFile) {
      formData.append('images', imageFile);
    } else if (data.images === null) {
      formData.append('deleteImage', 'true');
    }

    const apiCall = method === "create"
      ? Post(`advert`, formData)
      : Put(`advert/${data.id}`, formData);

    apiCall
      .then((response) => {
        setData(response.data.data);
        AddAlert(MessageResponse(response), "info");
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
        if (error?.response?.data) setErrors(error.response.data.data);
      });
  };

  const [openDel, setOpenDel] = useState(false);
  const onDelete = () => {
    setOpenDel(true);
  };

  const deleteSubmit = () => {
    Delete(`advert/${id}`, {})
      .then((response) => {
        AddAlert(MessageResponse(response), "info");
        navigate(-1);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  const handleDeleteImage = () => {
    setShowDeleteImageConfirm(true);
  };

  const confirmDeleteImage = () => {
    setImageUrl('');
    setImageFile(null);
    setData(prev => ({ ...prev, images: null }));
    setShowDeleteImageConfirm(false);
  };

  return (
    <Stack spacing={2}>
      <ConfirmDialog
        open={openDel}
        onClose={() => setOpenDel(false)}
        onSubmit={deleteSubmit}
        text={"กรุณากดยืนยันหากคุณต้องการจะลบโฆษณานี้"}
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
            ลบโฆษณา
          </Button>
        )}
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {!id
              ? useLang("เพิ่มโฆษณา", "Add New Advertisement")
              : useLang("ปรับปรุงโฆษณา", "Edit Advertisement")}
          </Box>
          <Divider />
          <Box sx={{ flex: 1 }}>
            <InputLabel sx={{ color: '#000' }}>{useLang("ป้ายโฆษณา*", "Banner*")}</InputLabel>
            <Box position="relative">
              <Button
                component="label"
                variant="outlined"
                sx={{ width: "100%", height: 200 }}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="banner"
                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                  />
                ) : (
                  "อัปโหลดภาพ"
                )}
                <input
                  type="file"
                  accept="image/*"
                  name="images"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </Button>
              {imageUrl && (
                <IconButton
                  onClick={handleDeleteImage}
                  sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.7)' }}
                >
                  <Icons.Delete />
                </IconButton>
              )}
            </Box>
          </Box>
          <Box sx={{ flex: 1 }}>
            <InputLabel sx={{ color: "#000" }}>
              {useLang("หัวข้อ", "Title")}
            </InputLabel>
            <TextField
              fullWidth
              value={data['title']}
              name="title"
              onChange={onChange}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <InputLabel sx={{ color: "#000" }}>
              {useLang("รายละเอียด", "Description")}
            </InputLabel>
            <ReactQuill
              value={data["description"]}
              onChange={(value) => {
                setData((prev) => ({
                  ...prev,
                  description: value,
                }));
              }}
            />
          </Box>
        </Stack>
      </Stack>

      <Button variant="contained" onClick={onSubmit}>
        {useLang("บันทึก", "Save")}
      </Button>

      <ConfirmDialog
        open={showDeleteImageConfirm}
        onClose={() => setShowDeleteImageConfirm(false)}
        onSubmit={confirmDeleteImage}
        text={useLang("คุณแน่ใจหรือไม่ที่จะลบรูปภาพนี้?", "Are you sure you want to delete this image?")}
      />
    </Stack>
  );
}

export default Advert_Form;