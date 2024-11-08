import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { HttpContext, MainContext } from "@/context/Context";
import {
  Box,
  Button,
  Divider,
  InputLabel,
  Paper,
  Stack,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import ConfirmDialog from "@/component/ConfirmDialog";

function Property_Form() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { AddAlert, useLang } = useContext(MainContext);
  const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } = useContext(HttpContext);

  const [data, setData] = useState({ id: -1, name: "" });
  const [guarantees, setGuarantees] = useState([]);
  const [editingGuarantees, setEditingGuarantees] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [openAddGuarantee, setOpenAddGuarantee] = useState(false);
  const [newGuarantee, setNewGuarantee] = useState("");
  const [openEditGuarantee, setOpenEditGuarantee] = useState(false);
  const [editingGuarantee, setEditingGuarantee] = useState(null);
  const [openDel, setOpenDel] = useState(false);

  useEffect(() => {
    if (id) {
      Get(`property/${id}`).then((response) => {
        if (response.data && response.data.data) {
          setData(response.data.data.property);
          const loadedGuarantees = response.data.data.guarantees || [];
          setGuarantees(loadedGuarantees);
          setEditingGuarantees(loadedGuarantees);
        } else {
          AddAlert("ไม่พบข้อมูลที่ต้องการ", "error");
        }
      }).catch(error => {
        AddAlert(ErrorResponse(error), "error");
      });
    }
  }, [id]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = () => {
    if (!data.name) {
      AddAlert(useLang("กรุณากรอกชื่อประเภทหลักประกัน", "Please enter the property name"), "error");
      return;
    }

    const apiCall = id ? Put(`property/update/${id}`, data) : Post(`property/create`, data);

    apiCall.then((response) => {
      setData(response.data.data);
      AddAlert(MessageResponse(response), "info");
      if (!id) navigate(-1);
      setIsEditingName(false);
    }).catch((error) => {
      AddAlert(ErrorResponse(error), "error");
    });
  };

  const handleAddGuarantee = () => {
    if (!newGuarantee.trim()) {
      AddAlert(useLang("กรุณากรอกชื่อหลักประกัน", "Please enter the guarantee name"), "error");
      return;
    }

    Post("guarantee/create", {
      name: newGuarantee,
      type: data.name,
      index: guarantees.length + 1,
    }).then((response) => {
      const newGuaranteeObj = response.data.data;
      setGuarantees(prev => [...prev, newGuaranteeObj]);
      setEditingGuarantees(prev => [...prev, newGuaranteeObj]);
      setNewGuarantee("");
      setOpenAddGuarantee(false);
      AddAlert(useLang("เพิ่มหลักประกันสำเร็จ", "Guarantee added successfully"), "info");
    }).catch((error) => {
      AddAlert(ErrorResponse(error), "error");
    });
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(editingGuarantees);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      index: index + 1,
    }));

    setEditingGuarantees(updatedItems);
  };

  const handleEditGuarantee = (guarantee) => {
    setEditingGuarantee({ ...guarantee });
    setOpenEditGuarantee(true);
  };

  const handleUpdateGuarantee = () => {
    const updatedGuarantees = editingGuarantees.map((g) =>
      g.id === editingGuarantee.id ? editingGuarantee : g
    );
    setEditingGuarantees(updatedGuarantees);
    setOpenEditGuarantee(false);
  };

  const handleDeleteGuarantee = (id) => {
    const updatedGuarantees = editingGuarantees.filter(guarantee => guarantee.id !== id);
    const reindexedGuarantees = updatedGuarantees.map((guarantee, index) => ({
      ...guarantee,
      index: index + 1,
    }));
    setEditingGuarantees(reindexedGuarantees);
  };

  const saveChanges = () => {
    const updateRequests = editingGuarantees
      .filter(guarantee => guarantees.some(original => original.id === guarantee.id))
      .map(guarantee => Put(`guarantee/update/${guarantee.id}`, guarantee));

    const deletedGuarantees = guarantees.filter(
      original => !editingGuarantees.some(temp => temp.id === original.id)
    );

    const deleteRequests = deletedGuarantees.map(guarantee =>
      Delete(`guarantee/delete/${guarantee.id}`)
    );

    Promise.all([...updateRequests, ...deleteRequests])
      .then(() => {
        AddAlert(useLang("บันทึกการเปลี่ยนแปลงสำเร็จ", "Changes saved successfully"), "info");
        setIsEditing(false);
        setGuarantees(editingGuarantees);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  const cancelEdit = () => {
    setEditingGuarantees(guarantees);
    setIsEditing(false);
  };

  const toggleEditName = () => {
    if (isEditingName) {
      onSubmit();
    }
    setIsEditingName(!isEditingName);
  };

  const onDelete = () => setOpenDel(true);

  const deleteSubmit = () => {
    Delete(`property/delete/${id}`)
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
        text={useLang("กรุณากดยืนยันหากคุณต้องการจะลบประเภทนี้", "Please confirm if you want to delete this property type")}
      />

      <Dialog open={openAddGuarantee} onClose={() => setOpenAddGuarantee(false)} fullWidth maxWidth="sm">
        <DialogTitle>{useLang("เพิ่มหลักประกัน", "Add Guarantee")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={useLang("ชื่อหลักประกัน", "Guarantee Name")}
            type="text"
            fullWidth
            value={newGuarantee}
            onChange={(e) => setNewGuarantee(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddGuarantee(false)}>{useLang("ยกเลิก", "Cancel")}</Button>
          <Button onClick={handleAddGuarantee}>{useLang("บันทึก", "Save")}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditGuarantee} onClose={() => setOpenEditGuarantee(false)} fullWidth maxWidth="sm">
        <DialogTitle>{useLang("แก้ไขหลักประกัน", "Edit Guarantee")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={useLang("ชื่อหลักประกัน", "Guarantee Name")}
            type="text"
            fullWidth
            value={editingGuarantee?.name || ""}
            onChange={(e) => setEditingGuarantee({ ...editingGuarantee, name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditGuarantee(false)}>{useLang("ยกเลิก", "Cancel")}</Button>
          <Button onClick={handleUpdateGuarantee}>{useLang("บันทึก", "Save")}</Button>
        </DialogActions>
      </Dialog>

      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
        <Button startIcon={<Icons.ArrowBackIos />} variant="contained" onClick={() => navigate(-1)}>
          {useLang("ย้อนกลับ", "Back")}
        </Button>
        {id && (
          <Button startIcon={<Icons.Delete />} color="error" variant="contained" onClick={onDelete}>
            {useLang("ลบประเภท", "Delete Property")}
          </Button>
        )}
      </Stack>

      <Stack component={Paper}>
        <Stack gap={4} sx={{ p: 4 }}>
          <Box component="span" sx={{ fontWeight: "bold" }}>
            {!id
              ? useLang("เพิ่มประเภทหลักประกัน", "Add New Property")
              : useLang("ปรับปรุงประเภทหลักประกัน", "Edit Property")}
          </Box>
          <Divider />
          <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
            <Box sx={{ flex: 1 }}>
              <InputLabel sx={{ color: "gray", fontWeight: 'bold' }}>
                {useLang("ชื่อประเภท", "Property Name")}
              </InputLabel>
              <TextField
                fullWidth
                value={data["name"]}
                name="name"
                onChange={onChange}
                inputProps={{
                  readOnly: id && !isEditingName,
                }}
              />

              <Button
                variant="contained"
                onClick={id ? toggleEditName : onSubmit}
                sx={{ marginTop: 2 }}
                startIcon={id && isEditingName ? <Icons.Save /> : <Icons.Edit />}
                disabled={!data.name.trim()}
              >
                {id
                  ? (isEditingName ? useLang("บันทึกชื่อประเภท", "Save Name") : useLang("แก้ไขชื่อประเภท", "Edit Name"))
                  : useLang("บันทึกชื่อประเภท", "Save Name")}
              </Button>
            </Box>
          </Stack>
          <Divider />

          {id && (
            <Box>
              <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                <InputLabel sx={{ color: "gray", fontWeight: 'bold' }}>
                  {useLang("หลักประกันในประเภทนี้", "Guarantees in this property")}
                </InputLabel>
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Icons.Add />}
                    onClick={() => setOpenAddGuarantee(true)}
                    disabled={isEditing}
                  >
                    {useLang("เพิ่มหลักประกัน", "Add Guarantee")}
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={isEditing ? <Icons.Close /> : <Icons.Edit />}
                    onClick={() => {
                      if (isEditing) {
                        cancelEdit();
                      } else {
                        setIsEditing(true);
                        setEditingGuarantees([...guarantees]);
                      }
                    }}
                    sx={{
                      backgroundColor: isEditing ? 'error.main' : 'primary.main',
                      '&:hover': {
                        backgroundColor: isEditing ? 'darkred' : 'primary.dark',
                      },
                    }}
                  >
                    {isEditing ? useLang("ยกเลิกการแก้ไข", "Undo edit") : useLang("แก้ไขหลักประกัน", "Edit Guarantee")}
                  </Button>
                </Stack>
              </Stack>

              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="guarantees">
                  {(provided) => (
                    <List {...provided.droppableProps} ref={provided.innerRef}>
                      {(isEditing ? editingGuarantees : guarantees).map((guarantee, index) => (
                        <Draggable key={guarantee.id} draggableId={guarantee.id.toString()} index={index} isDragDisabled={!isEditing}>
                          {(provided) => (
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...(isEditing && provided.dragHandleProps)}
                              sx={{
                                border: "1px solid #ccc",
                                borderRadius: "8px",
                                marginBottom: "8px",
                                padding: "8px",
                              }}
                            >
                              <ListItemText primary={`${index + 1}. ${guarantee.name}`} />
                              {isEditing && (
                                <Stack direction="row" spacing={1}>
                                  <IconButton edge="end" aria-label="edit" onClick={() => handleEditGuarantee(guarantee)}>
                                    <Icons.Edit />
                                  </IconButton>
                                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteGuarantee(guarantee.id)}>
                                    <Icons.Delete />
                                  </IconButton>
                                </Stack>
                              )}
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </DragDropContext>
            </Box>
          )}
        </Stack>
      </Stack>

      {isEditing && (
        <Button
          variant="contained"
          color="primary"
          onClick={saveChanges}
          startIcon={<Icons.Save />}
          sx={{ mt: 2 }}
        >
          {useLang("บันทึกการเปลี่ยนแปลง", "Save Changes")}
        </Button>
      )}
    </Stack>
  );
}

export default Property_Form;