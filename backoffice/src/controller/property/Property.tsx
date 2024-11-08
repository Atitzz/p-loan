import { HttpContext, MainContext } from "@/context/Context";
import { Button, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GridRender from "@/component/GridRender";
import { GridColDef } from "@mui/x-data-grid";
import * as Icons from "@mui/icons-material";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Property() {
  const { status } = useParams();
  const { AddAlert, dataRoute, useLang } = useContext(MainContext);
  const { Get, Put, ErrorResponse } = useContext(HttpContext);
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingIndex, setIsEditingIndex] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [pages, setPages] = useState({
    page: 1,
    total: 0,
    limit: 20,
  });

  useEffect(() => {
    setPage(1);
  }, [status]);

  useEffect(() => {
    setIsLoading(true);
    Get(`property?search=${search}&page=${page}&limit=${pageSize}`)
      .then((response) => {
        const indexedData = response.data.data.map((item, index) => ({
          ...item,
          index: index + 1 + (page - 1) * pageSize,
        }));
        setData(indexedData);
        setOriginalData(indexedData);
        setPages(response.data.pages);
        setTimeout(() => {
          setIsLoading(false);
        }, 250);
      })
      .catch((err) => AddAlert(ErrorResponse(err), "error"));
  }, [status, page, search, pageSize]);

  const onCreate = () => {
    const __route = dataRoute.find((x) => x.component == "property_form");
    navigate(`${__route.link}`);
  };

  const onUpdate = (id) => {
    const __route = dataRoute.find((x) => x.component == "property_form");
    navigate(`${__route.link}/${id}`);
  };

  const handleOnDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(data);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const reindexedItems = items.map((item, index) => ({
      ...item,
      index: index + 1,
    }));

    setData(reindexedItems);
    const isChanged = JSON.stringify(reindexedItems) !== JSON.stringify(originalData);
    setHasChanges(isChanged);
  };

  const saveReorderedIndex = () => {
    const updateRequests = data.map((item) => Put(`property/update/${item.id}`, { index: item.index }));
    Promise.all(updateRequests)
      .then(() => {
        AddAlert(useLang("บันทึกการเปลี่ยนแปลงเรียบร้อย", "Changes saved successfully"), "info");
        setIsEditingIndex(false);
        setHasChanges(false);
        setOriginalData(data);
      })
      .catch((error) => {
        AddAlert(ErrorResponse(error), "error");
      });
  };

  const cancelEditing = () => {
    setData(originalData);
    setIsEditingIndex(false);
    setHasChanges(false);
  };

  const columns: GridColDef<(typeof data)[number]>[] = [
    {
      field: "index",
      headerName: "#",
      width: 50,
    },
    {
      field: "name",
      headerName: "ประเภท",
      flex: 1,
    },
    {
      field: "actions",
      type: "actions",
      headerName: useLang("ดำเนินการ", "Actions"),
      width: 250,
      cellClassName: "actions",
      getActions: ({ id }) => {
        return [
          <Button
            variant="outlined"
            color="secondary"
            sx={{ gap: 2, alignItems: "center" }}
            onClick={() => onUpdate(Number(id))}
            startIcon={<Icons.Visibility />}
          >
            {useLang("เรียกดู")}
          </Button>,
        ];
      },
    },
  ];

  const actionButtons = (
    <Stack direction="row" spacing={2} justifyContent="flex-end">
      <Button variant="contained" startIcon={<Icons.Add />} onClick={onCreate} sx={{ height: '36px' }}>
        {useLang("เพิ่มใหม่", "Add New")}
      </Button>
      <Button
        variant="contained"
        startIcon={isEditingIndex ? (hasChanges ? <Icons.Save /> : <Icons.Close />) : <Icons.Edit />}
        onClick={() => {
          if (isEditingIndex) {
            if (hasChanges) {
              saveReorderedIndex();
            } else {
              cancelEditing();
            }
          } else {
            setIsEditingIndex(true);
          }
        }}
        sx={{
          backgroundColor: isEditingIndex ? (hasChanges ? "success.main" : "error.main") : "primary.main",
          "&:hover": {
            backgroundColor: isEditingIndex
              ? hasChanges
                ? "success.dark"
                : "error.dark"
              : "primary.dark",
          },
        }}
      >
        {isEditingIndex
          ? hasChanges
            ? useLang("บันทึก", "Save Changes")
            : useLang("ยกเลิกการแก้ไข", "Cancel Editing")
          : useLang("แก้ไขลำดับ", "Edit")}
      </Button>
    </Stack>
  );

  return (
    <Stack spacing={1}>
      {isEditingIndex ? (
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Stack spacing={2} width="100%">
         {actionButtons}
          <Droppable droppableId="properties">
            {(provided) => (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell width="50px">#</TableCell>
                      <TableCell>ประเภท</TableCell>
                      <TableCell width="250px">{useLang("ดำเนินการ", "Actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                    {data.map((item, index) => (
                      <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                        {(provided) => (
                          <TableRow
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TableCell>{item.index}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              <Button
                                variant="outlined"
                                color="secondary"
                                sx={{ gap: 2, alignItems: "center" }}
                                onClick={() => onUpdate(Number(item.id))}
                                startIcon={<Icons.Visibility />}
                              >
                                {useLang("เรียกดู")}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Droppable>
          </Stack>
        </DragDropContext>
      ) : (
        <GridRender
          isLoading={isLoading}
          title={useLang("เส้นทาง", "Route")}
          columns={columns}
          rows={data}
          insertEnd={actionButtons}
          thisPage={setPage}
          onSearchText={setSearch}
          pages={pages}
          pageSize={setPageSize}
        />
      )}
    </Stack>
  );
}

export default Property;