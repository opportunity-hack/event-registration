import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Emoji from 'react-emoji-render';
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { formatDate } from '../helpers/dateHelper';
import ReactTooltip from "react-tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === "desc"
    ? (a, b) => desc(a, b, orderBy)
    : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
  {
    id: "email",
    numeric: false,
    disablePadding: true,
    label: "Email"
  },
  {
    id: "dateEntered",
    numeric: false,
    disablePadding: true,
    label: "Date Entered"
  },
  {
    id: "body",
    numeric: false,
    disablePadding: true,
    label: "Comment"
  },
  {
    id: "score",
    numeric: false,
    disablePadding: true,
    label: "Analysis"
  }
];

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
    onRequestSort
  } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={order}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired
};

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(1)
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2)
  },
  table: {
    minWidth: 750
  },
  tableWrapper: {
    overflowX: "auto"
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  },
  button: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5)
  }
}));

export default function FeedbackTable({ feedbacks }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, feedbacks.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      {feedbacks.length === 0 ? (
        <>No feedback yet</>
      ) : (
        <>
          <Paper className={classes.paper}>
            <div className={classes.tableWrapper}>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={"medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {stableSort(feedbacks, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((feedback, index) => {
						const labelId = `enhanced-table-checkbox-${index}`;
						const feedbackScore = feedback.score;
						let emoji = <Emoji text=":neutral_face:" />
						if (feedbackScore >= 0.5) {
							emoji = <Emoji text=":smiley:" />
						}
						else if (feedbackScore <= -0.5) {
							emoji = <Emoji text=":white_frowning_face:" />
						}

                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={feedback.score + "-" + feedback.dateEntered}
                        >
						  <TableCell data-tip data-for="feedback-tool-tip" component="th" id={labelId} scope="row">
							<CopyToClipboard text={feedback.email}>
							  <span style={{ cursor: "pointer" }}>{feedback.email}</span>
							</CopyToClipboard>
							<ReactTooltip
							  id="feedback-tool-tip"
							  event="click"
							  eventOff="mouseleave"
							  isCapture={true}
							>
							  <p>Copied!</p>
							</ReactTooltip>
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
							{formatDate(feedback.dateEntered)}
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
                            {feedback.body}
                          </TableCell>
                          <TableCell component="th" id={labelId} scope="row">
							{emoji}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={feedbacks.length}
              rowsPerPage={rowsPerPage}
              page={page}
              backIconButtonProps={{
                "aria-label": "previous page"
              }}
              nextIconButtonProps={{
                "aria-label": "next page"
              }}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </>
      )}
    </div>
  );
}
