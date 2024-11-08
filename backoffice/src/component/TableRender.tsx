import { icon } from "@/_layout/json/icon";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Chip,
  Divider,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  getContrastRatio,
} from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
const days = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];
interface Fields {
  title: string;
  title2?: string;
  key: string;
  subText?: string;
  key2?: string;
  subText2?: string;
  type?: string;
  path?: string;
  param_key?: string;
  type2?: string;
  path2?: string;
  param_key2?: string;
  is_status?: {
    text: string;
    value: any;
    color: string;
  }[];
  array?: string;
  align?: string;
  width?: string | number;
  role?: string;
  action?: Actions[];
  action2?: Actions[];
}

interface Actions {
  func: (e) => void;
  name: any;
  role?: string;
}

interface Pages {
  page: number;
  total: number;
  limit: number;
}

function TableRender({
  title,
  isTools = true,
  fields,
  data,
  thisPage,
  pages,
  selectedDate,
  insert,
  insertEnd,
  insertUnderTools,
  onDonload,
  maxwidth = "78vw",
  sum,
}: {
  title?: string;
  isTools?: boolean;
  fields: Fields[];
  data: any[];
  thisPage?: any;
  pages?: Pages;
  selectedDate?: any;
  insert?: any;
  insertEnd?: any;
  insertUnderTools?: any;
  sum?: boolean;
  maxwidth?: string | number;
  onDonload?: boolean;
}) {
  const {} = useContext(MainContext);
  const {} = useContext(HttpContext);
  const { Download_Report, toDate, toFloat } = useContext(ToolsContext);
  const [page, setPage] = React.useState(1);

  const changePages = (event: any, newPage: number) => {
    event?.preventDefault();
    setPage(newPage);
  };
  const currentDate = new Date();
  const previousMonth = new Date(
    currentDate.setMonth(currentDate.getMonth() - 1)
  );
  const [search, setSearch] = useState({
    start: previousMonth.toISOString().split("T")[0],
    end: new Date(new Date().setDate(new Date().getDate() + 1))
      .toISOString()
      .split("T")[0],
  });

  const changeDate = (e) => {
    const { name, value } = e.target;
    setSearch((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  useEffect(() => {
    if (selectedDate)
      selectedDate((prev) => {
        return { ...prev, ...search };
      });
  }, [search]);
  const [searchText, setSearchText] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const onSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  useEffect(() => {
    filterRows(searchText);
  }, [searchText, data]);
  const filterRows = (searchText: string) => {
    if (!searchText) {
      setFilteredRows(data); // ถ้าไม่มีข้อความค้นหาให้แสดงทั้งหมด
    } else {
      const filteredData = data.filter(
        ({ id, created_at, updated_at, deleted_at, date, ...row }) => {
          // Convert all values in the row object to a single string
          const rowValues = Object.values(row)
            .filter((value) => typeof value === "string")
            .join(" ")
            .toLowerCase();
          return rowValues.includes(searchText.toLowerCase());
        }
      );
      setFilteredRows(filteredData);
    }
  };

  const Download = () => {
    if (data.length < 1) return;
    const column = fields.map((x) => x.title);
    const toArray = filteredRows.map((x) => {
      return fields.map((field) => {
        return x[field.key];
      });
    });
    Download_Report(
      `${title} ${search.start} - ${search.end}`,
      column,
      toArray
    );
  };

  const summary = useMemo(() => {
    const reduced = filteredRows.reduce((a, b) => {
      if (b?.["is_reject"] === "y") return a;
      for (const field of fields) {
        if (field?.type && field.type == "float") {
          if (a?.[field.key]) a[field.key] += Number(b[field.key]);
          else a[field.key] = Number(b[field.key]);
        } else a[field.key] = "";
      }
      return a;
    }, {});
    return reduced;
  }, [filteredRows]);

  const subText = (text, value) => {
    if (!text) return value;
    const __split = text.split("?");
    if (__split.length > 1) return `${__split[0]}${value}${__split[1]}`;
    else return value;
  };

  const isStatus = (field, value) => {
    if (!field)
      return <Chip label={subText(field?.subText, value[field.key])} />;
    const __exist = field.find((x) => x.value == value);
    if (__exist)
      return (
        <Chip
          sx={{
            bgcolor: `${__exist.color}`,
            color:
              getContrastRatio(__exist.color, "#fff") > 4.5 ? "#fff" : "#111",
          }}
          label={subText(field?.subText, __exist.text)}
        />
      );
  };

  useEffect(() => {
    thisPage(page);
  }, [page]);
  return (
    <Stack spacing={4}>
      {isTools && (
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ alignItems: "center" }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box component="h3" sx={{ m: 1, textAlign: "center" }}>
              {title}
            </Box>
            {insert}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchText}
              onChange={onSearch}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {icon["SearchIcon"]}
                  </InputAdornment>
                ),
                sx: { bgcolor: "white" },
              }}
            />
            {selectedDate && (
              <>
                <TextField
                  size="small"
                  type="date"
                  name="start"
                  value={search.start}
                  onChange={changeDate}
                />
                <TextField
                  size="small"
                  type="date"
                  name="end"
                  value={search.end}
                  onChange={changeDate}
                />
              </>
            )}
            {insertEnd}
            {onDonload && (
              <Button variant="contained" onClick={Download}>
                Download
              </Button>
            )}
          </Stack>
        </Stack>
      )}
      {insertUnderTools && insertUnderTools}
      <Stack spacing={2} component={Paper} sx={{ p: 4 }}>
        <Stack spacing={1} sx={{ maxWidth: maxwidth, overflow: "auto" }}>
          <Stack direction="row" spacing={1} sx={{ py: 2 }}>
            {fields.map((header, index) => (
              <Box
                component="span"
                key={`header-${index}`}
                sx={{
                  fontWeight: "bold",
                  textAlign: header?.align || "start",
                  flex: header?.width ? `0 0 ${header.width}` : 1
                }}
              >
                {header.title}
              </Box>
            ))}
          </Stack>
          <Divider />
          {filteredRows.map((value, i) => (
            <Stack key={`data-${i}`}>
              <Stack
                direction="row"
                spacing={2}
                sx={{
                  alignItems: "center",
                  transition: "background-color 0.3s", // เพิ่ม transition เพื่อทำให้การเปลี่ยนสีเรื่องการโฮเวอร์เป็นไปอย่างนุ่มนวล
                  ":hover": {
                    backgroundColor: "#11111125",
                  },
                  position: "relative",
                }}
              >
                {fields.map((field, ii) => (
                  <Stack
                    spacing={1}
                    key={`field-${ii}`}
                    sx={{
                      flex: field?.width ? `0 0 ${field.width}` : 1,
                      wordWrap: "break-word",
                      textAlign: field?.align ? field.align : "start",
                    }}
                  >
                    <Box component="span">
                      {field?.type === "link" ? (
                        <Box
                          component="span"
                          onClick={() =>
                            console.log(
                              `${field?.path}/${value[field?.param_key]}`
                            )
                          }
                          sx={{ color: "#0d6efd", cursor: "pointer" }}
                        >
                          {subText(field?.subText, value[field.key])}
                        </Box>
                      ) : field?.type === "status" ? (
                        isStatus(field?.is_status, value[field.key])
                      ) : field?.type === "action" ? (
                        <TextField
                          select
                          size="small"
                          value={"x"}
                          InputProps={{
                            sx: {
                              ".MuiOutlinedInput-notchedOutline": {
                                border: "none",
                              },
                            },
                          }}
                        >
                          <MenuItem value="x" sx={{ display: "none" }}>
                            {field.title}
                          </MenuItem>
                          {field.action.map((control, k) => (
                            <MenuItem
                              key={`menu-${k}`}
                              onClick={() =>
                                control.func(
                                  subText(field?.subText, value[field.key])
                                )
                              }
                              value={control.name}
                            >
                              {control.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      ) : field?.type === "days" ? (
                        subText(
                          field?.subText,
                          days[Number(value[field.key])] || "ข้อมูลไม่ถูกต้อง"
                        )
                      ) : field?.type === "array" ? (
                        subText(
                          field?.subText,
                          value[field.key]
                            .map((x) => x[field?.array || "name"])
                            .join(",")
                        )
                      ) : field?.type === "bool" ? (
                        value[field.key] == 1 ? (
                          "ใช่"
                        ) : (
                          "ไม่ใช่"
                        )
                      ) : field?.type === "date" ? (
                        subText(field?.subText, toDate(value[field.key]))
                      ) : field?.type === "float" ? (
                        subText(field?.subText, toFloat(value[field.key]))
                      ) : (
                        subText(field?.subText, value[field.key])
                      )}
                    </Box>
                    {field?.key2 && (
                      <Box component="span" sx={{ color: "#1e9ff2" }}>
                        {field?.type2 === "link" ? (
                          <Box
                            component="span"
                            onClick={() =>
                              console.log(
                                `${field?.path2}/${value[field?.param_key2]}`
                              )
                            }
                            sx={{ color: "#0d6efd", cursor: "pointer" }}
                          >
                            {subText(field?.subText2, value[field.key2])}
                          </Box>
                        ) : field?.type2 === "action" ? (
                          <TextField
                            select
                            size="small"
                            value={"x"}
                            InputProps={{
                              sx: {
                                ".MuiOutlinedInput-notchedOutline": {
                                  border: "none",
                                },
                              },
                            }}
                          >
                            <MenuItem value="x" sx={{ display: "none" }}>
                              {field.title2}
                            </MenuItem>
                            {field.action2.map((control, k) => (
                              <MenuItem
                                key={`menu-${k}`}
                                onClick={() =>
                                  control.func(
                                    subText(field?.subText2, value[field.key2])
                                  )
                                }
                                value={control.name}
                              >
                                {control.name}
                              </MenuItem>
                            ))}
                          </TextField>
                        ) : field?.type2 === "days" ? (
                          subText(
                            field?.subText2,
                            days[Number(value[field.key2])] ||
                              "ข้อมูลไม่ถูกต้อง"
                          )
                        ) : field?.type2 === "array" ? (
                          subText(
                            field?.subText2,
                            value[field.key2]
                              .map((x) => x[field?.array || "name"])
                              .join(",")
                          )
                        ) : field?.type2 === "bool" ? (
                          value[field.key2] == 1 ? (
                            "ใช่"
                          ) : (
                            "ไม่ใช่"
                          )
                        ) : field?.type2 === "date" ? (
                          subText(field?.subText2, toDate(value[field.key2]))
                        ) : field?.type2 === "float" ? (
                          subText(field?.subText2, toFloat(value[field.key2]))
                        ) : (
                          subText(field?.subText2, value[field.key2])
                        )}
                      </Box>
                    )}
                  </Stack>
                ))}
                {value?.["is_reject"] === "y" && ( // สร้างเส้นทับตรงกลางเฉพาะเมื่อ is_reject เป็น 'y'
                  <React.Fragment>
                    <Box
                      component="span"
                      style={{
                        position: "absolute",
                        left: 0,
                        width: "85%", // กำหนดความกว้างของเส้นตรงกลาง
                        bottom: "50%", // ปรับตำแหน่งให้เส้นตรงกลางอยู่ตรงกลางข้อความ
                        borderBottom: "1px solid black", // ปรับสีและขนาดของเส้นตรงกลางตามต้องการ
                      }}
                    />
                    <Box
                      component="span"
                      style={{
                        position: "absolute",
                        left: 0,
                        width: "85%", // กำหนดความกว้างของเส้นตรงกลาง
                        bottom: "45%", // ปรับตำแหน่งให้เส้นตรงกลางอยู่ตรงกลางข้อความ
                        borderBottom: "1px solid black", // ปรับสีและขนาดของเส้นตรงกลางตามต้องการ
                      }}
                    />
                    <Box
                      component="span"
                      style={{
                        position: "absolute",
                        left: 0,
                        width: "85%", // กำหนดความกว้างของเส้นตรงกลาง
                        bottom: "40%", // ปรับตำแหน่งให้เส้นตรงกลางอยู่ตรงกลางข้อความ
                        borderBottom: "1px solid black", // ปรับสีและขนาดของเส้นตรงกลางตามต้องการ
                      }}
                    />
                  </React.Fragment>
                )}
              </Stack>
              <Divider sx={{ mt: 1 }} />
            </Stack>
          ))}
        </Stack>
        <Divider />
        {sum && (
          <>
            <Stack>
              <Box component="h3" sx={{ m: 1, textAlign: "center" }}>
                Summary
              </Box>
            </Stack>
            <Divider />
            <Stack direction="row" spacing={1}>
              {fields.map((header, index) =>
                header?.type === "float" ? (
                  <InputLabel
                    key={`sum-${index}`}
                    sx={{
                      flex: !header?.width ? 1 : undefined,
                      width: header?.width ? header.width : 250,
                      textAlign: header?.align ? header.align : "start",
                    }}
                  >
                    {header.title}
                  </InputLabel>
                ) : (
                  <InputLabel
                    key={`sum-${index}`}
                    sx={{
                      flex: 1,
                      width: header?.width ? header.width : 250,
                      textAlign: header?.align ? header.align : "start",
                    }}
                  ></InputLabel>
                )
              )}
            </Stack>
            <Stack direction="row">
              {fields.map((header, index) =>
                header?.type === "float" ? (
                  <Stack
                    key={`sumdata-${index}`}
                    sx={{
                      flex: 1,
                      width: header?.width ? header.width : 250,
                      wordWrap: "break-word",
                      textAlign: header?.align ? header.align : "start",
                    }}
                  >
                    {typeof summary[header.key] == "number"
                      ? toFloat(summary[header.key])
                      : ""}
                  </Stack>
                ) : (
                  <InputLabel
                    key={`sum-${index}`}
                    sx={{
                      flex: 1,
                      width: header?.width ? header.width : 250,
                      textAlign: header?.align ? header.align : "start",
                    }}
                  ></InputLabel>
                )
              )}
            </Stack>
            <Divider />
          </>
        )}
        <Pagination
          count={Math.ceil(pages.total / pages.limit)}
          onChange={changePages}
          page={page}
        />
      </Stack>
    </Stack>
  );
}

export default TableRender;
