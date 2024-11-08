import { icon } from "@/_layout/json/icon";
import { HttpContext, MainContext, ToolsContext } from "@/context/Context";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  TextField,
  getContrastRatio,
} from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridToolbar,
  GridToolbarContainer,
} from "@mui/x-data-grid";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import * as Icons from "@mui/icons-material";
const days = [
  "อาทิตย์",
  "จันทร์",
  "อังคาร",
  "พุธ",
  "พฤหัสบดี",
  "ศุกร์",
  "เสาร์",
];

function GridRender({
  isLoading,
  title = "",
  isTools = true,
  columns,
  rows,
  thisPage,
  pages,
  pageSize,
  selectedDate,
  onSearchText,
  insert,
  insertEnd,
  insertUnderTools,
  sum,
  ...gridProps
}: any) {
  const { dataRoute, useLang } = useContext(MainContext);
  const {} = useContext(HttpContext);
  const { Download_Report, toDate, toFloat } = useContext(ToolsContext);
  const __location = useLocation();

  const [HeadTitle, setHeadTitle] = React.useState("Title");

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
  const onSearch = (e) => {
    const { value } = e.target;
    setSearchText(value);
  };

  const eventSearchText = (e) => {
    if (e.key === "Enter") {
      if (onSearchText) onSearchText(searchText);
    }
  };

  const Download = () => {
    if (rows.length < 1) return;
    const column = columns.map((x) => x.headerName);
    const toArray = rows.map((x) => {
      return columns.map((field) => {
        return x[field.field];
      });
    });
    Download_Report(
      `${HeadTitle} ${search.start} - ${search.end}`,
      column,
      toArray
    );
  };

  //   const summary = useMemo(() => {
  //     const reduced = filteredRows.reduce((a, b) => {
  //       if (b?.["is_reject"] === "y") return a;
  //       for (const field of fields) {
  //         if (field?.type && field.type == "float") {
  //           if (a?.[field.key]) a[field.key] += Number(b[field.key]);
  //           else a[field.key] = Number(b[field.key]);
  //         } else a[field.key] = "";
  //       }
  //       return a;
  //     }, {});
  //     return reduced;
  //   }, [filteredRows]);

  //   const subText = (text, value) => {
  //     if (!text) return value;
  //     const __split = text.split("?");
  //     if (__split.length > 1) return `${__split[0]}${value}${__split[1]}`;
  //     else return value;
  //   };

  //   const isStatus = (field, value) => {
  //     if (!field)
  //       return <Chip label={subText(field?.subText, value[field.key])} />;
  //     const __exist = field.find((x) => x.value == value);
  //     if (__exist)
  //       return (
  //         <Chip
  //           sx={{
  //             bgcolor: `${__exist.color}`,
  //             color:
  //               getContrastRatio(__exist.color, "#fff") > 4.5 ? "#fff" : "#111",
  //           }}
  //           label={subText(field?.subText, __exist.text)}
  //         />
  //       );
  //   };

  const [paginationModel, setPaginationModel] = React.useState({
    pageSize: 25,
    page: 0,
  });

  useEffect(() => {
    thisPage(paginationModel.page + 1);
    pageSize(paginationModel.pageSize);
    const __route = dataRoute.find((x) => x.link == __location.pathname);
    setHeadTitle(!__route ? title : useLang(__route.name_th, __route.name));
  }, [paginationModel]);

  return (
    <Stack gap={4}>
      {isTools && (
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ alignItems: "center" }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box component="h3" sx={{ m: 1, textAlign: "center" }}>
              {HeadTitle}
            </Box>
            {insert}
          </Stack>
          <Stack direction="row" spacing={2}>
            <TextField
              size="small"
              placeholder="Search..."
              value={searchText}
              onChange={onSearch}
              onKeyDown={eventSearchText}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>{icon["SearchIcon"]}</IconButton>
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
          </Stack>
        </Stack>
      )}
      {insertUnderTools && insertUnderTools}
      <DataGrid
        autoHeight
        slots={{ toolbar: { ...GridToolbar } }}
        slotProps={{
          loadingOverlay: {
            variant: "skeleton",
            noRowsVariant: "skeleton",
          },
          toolbar: {
            csvOptions: {
              fileName: HeadTitle,
              utf8WithBom: true,
            },
          },
        }}
        sx={{ bgcolor: "white", p: 4 }}
        rows={rows}
        columns={columns}
        //   onRowSelectionModelChange={(newRowSelectionModel) => {
        //     console.log(newRowSelectionModel);
        //   }}
        pageSizeOptions={[25, 50, 75, 100]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        loading={isLoading}
        paginationMode="server"
        rowCount={pages.total}
        {...gridProps}
      />
    </Stack>
  );
}

export default GridRender;
