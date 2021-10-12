import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import {
  TableContainer,
  Table,
  TablePagination,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableFooter
} from "@mui/material";
import {
  Container,
  CircularProgress,
  Typography,
  Box,
  Avatar,
  Checkbox,
  Button,
  ButtonGroup,
  Paper
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import getTodo from "./api";

function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired
};

export default function Todo() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [element, setElement] = useState({});
  const [isEditing, setEditing] = useState({});
  const [isSaving, setSaving] = useState({});

  useEffect(() => {
    async function getTodoList() {
      const [result, error] = await getTodo();

      if (error) return null;

      setList(result);
      setLoading(false);
    }

    getTodoList();
  }, [isSaving]);

  const handleCheckboxChange = (indexList) => {
    const realIndex = page * pageSize + indexList;
    const newList = list.map((item, index) => {
      if (index === realIndex) return { ...item, completed: !item.completed };
      return item;
    });

    setList(newList);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * pageSize - list.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading)
    return (
      <div
        style={{
          height: "100vh",
          display: "grid",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress
        // thickness="4px"
        // speed="0.65s"
        // emptyColor="gray.200"
        // color="blue.500"
        // size="xl"
        />
      </div>
    );

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="center"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
        }}
      >
        <Box>
          <Typography fontSize="2rem" fontWeight="700" fontFamily="Segoe UI">
            Lista de tareas
          </Typography>
        </Box>
        <Box borderWidth="1px" borderRadius="xl">
          <TableContainer component={Paper}>
            <Table variant="simple">
              <TableHead>
                <TableRow>
                  <TableCell>Usuario</TableCell>
                  <TableCell>Tarea</TableCell>
                  <TableCell>Completado</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {list
                  .slice(page * pageSize, page * pageSize + pageSize)
                  .map((listItem, indexItem) => (
                    <TableRow>
                      <TableCell>
                        <Avatar name={listItem.userName} />
                      </TableCell>

                      <TableCell>
                        <Typography
                          as={listItem.completed ? "del" : ""}
                          color={listItem.completed ? "gray" : "black"}
                        >
                          {listItem.title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          onChange={() => handleCheckboxChange(indexItem)}
                          checked={listItem.completed}
                          color="success"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: "All", value: -1 }
                    ]}
                    colSpan={3}
                    count={list.length}
                    rowsPerPage={pageSize}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        "aria-label": "rows per page"
                      },
                      native: true
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
}
