// import { HttpContext, MainContext } from "@/context/Context";
// import {
//   Box,
//   Button,
//   Divider,
//   InputLabel,
//   MenuItem,
//   Paper,
//   Stack,
//   TextField,
// } from "@mui/material";
// import { useContext, useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import * as Icons from "@mui/icons-material";
// const defaultData = {
//   id: -1,
//   created_at: null,
//   updated_at: null,
//   deleted_at: null,
//   type: "",
//   name: "",
// };
// type errorDefault = {
//   field: string;
//   message: string;
// }[];
// import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";

// import ConfirmDialog from "@/component/ConfirmDialog";

// function Guarantee_Form() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { AddAlert, useLang } = useContext(MainContext);
//   const { Get, Put, Post, Delete, ErrorResponse, MessageResponse } =
//     useContext(HttpContext);
//   //   const { toDate, toTHB, toFloat } = useContext(ToolsContext);
//   const [data, setData] = useState(defaultData);
//   const [erros, setErrors] = useState<errorDefault>([]);
//   const [method, setMethod] = useState("create");

//   const [guaranteeTypes, setGuaranteeTypes] = useState([]);
//   const [search, setSearch] = useState("");


//   useEffect(() => {
//     Get(`property/${id}`).then((response) => {
//       setGuaranteeTypes(response.data.data);
//     });


//     if (id) {
//       setMethod("edit");
//       Get(`guarantee/${id}`).then((response) => {
//         setData(response.data.data);
//       });
//     } else {
//       setMethod("create");
//     }
//   }, [id]);
//   const onChange = (e) => {
//     const { name, value } = e.target;
//     setData((prev) => {
//       return {
//         ...prev,
//         [name]: value,
//       };
//     });
//   };

//   const onSelectChange = (e) => {
//     const { value } = e.target;
//     setData((prev) => ({
//       ...prev,
//       type: value,
//     }));
//   };

//   const onSubmit = () => {
//     if (method === "create") {
//       Post(`guarantee/create`, {
//         ...data,
//       })
//         .then((response) => {
//           setData(response.data.data);
//           AddAlert(MessageResponse(response), "info");
//           navigate(-1);
//         })
//         .catch((error) => {
//           AddAlert(ErrorResponse(error), "error");
//           if (error?.response?.data) setErrors(error.response.data.data);
//         });
//     } else {
//       Put(`guarantee/update/${data.id}`, {
//         ...data,
//       })
//         .then((response) => {
//           setData(response.data.data);
//           AddAlert(MessageResponse(response), "info");
//           navigate(-1);
//         })
//         .catch((error) => {
//           AddAlert(ErrorResponse(error), "error");
//           if (error?.response?.data) setErrors(error.response.data.data);
//         });
//     }
//   };

//   const [openDel, setOpenDel] = useState(false);
//   const onDelete = () => {
//     setOpenDel(true);
//   };

//   const deleteSubmit = () => {
//     Delete(`guarantee/delete/${id}`, {})
//       .then((response) => {
//         AddAlert(MessageResponse(response), "info");
//         navigate(-1);
//       })
//       .catch((error) => {
//         AddAlert(ErrorResponse(error), "error");
//       });
//   };
//   return (
//     <Stack spacing={2}>
//       <ConfirmDialog
//         open={openDel}
//         onClose={() => setOpenDel(false)}
//         onSubmit={deleteSubmit}
//         text={"กรุณากดยืนยันหากคุณต้องการจะลบหลักประกันนี้"}
//       />
//       <Stack direction="row" sx={{ justifyContent: "space-between" }}>
//         <Button
//           startIcon={<Icons.ArrowBackIos />}
//           variant="contained"
//           onClick={() => navigate(-1)}
//         >
//           ย้อนกลับ
//         </Button>
//         {id && (
//           <Button
//             startIcon={<Icons.Delete />}
//             color="error"
//             variant="contained"
//             onClick={onDelete}
//           >
//             ลบหลักประกัน
//           </Button>
//         )}
//       </Stack>

//       <Stack component={Paper}>
//         <Stack gap={4} sx={{ p: 4 }}>
//           <Box component="span" sx={{ fontWeight: "bold" }}>
//             {!id
//               ? useLang("เพิ่มหลักประกัน", "Add New Guarantee")
//               : useLang("ปรับปรุงหลักประกัน", "Edit Guarantee")}
//           </Box>
//           <Divider />
//           <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
//             <Box sx={{ flex: 1 }}>
//               <InputLabel sx={{ color: "#000" }}>
//                 {useLang("ประเภท", "Guarantee Type")}
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 select
//                 value={data["type"]}
//                 name="type"
//                 onChange={onSelectChange}
//                 // label={useLang("ประเภทหลักประกัน", "Guarantee Type")}
//               >
//                 {guaranteeTypes.map((type) => (
//                   <MenuItem key={type.id} value={type.name}>
//                     {type.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </Box>
//           </Stack>
//           <Stack direction="row" gap={4} flexWrap="wrap" sx={{ width: "100%" }}>
//             <Box sx={{ flex: 1 }}>
//               <InputLabel sx={{ color: "#000" }}>
//                 {useLang("ชื่อหลักประกัน", "Guarantee Name")}
//               </InputLabel>
//               <TextField
//                 fullWidth
//                 value={data["name"]}
//                 name="name"
//                 onChange={onChange}
//               />
//             </Box>
//           </Stack>


//         </Stack>
//       </Stack>

//       <Button variant="contained" onClick={onSubmit}>
//         บันทึก
//       </Button>
//     </Stack>
//   );
// }
// export default Guarantee_Form
