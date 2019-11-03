import React from "react";
import config from "../config.json";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import useRequest from "../hooks/useRequest";
import { lighten, makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from '@material-ui/icons/Close';
import ReactTooltip from "react-tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	ButtonGroup,
	TableBody,
	Table,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Typography,
	Paper,
	Avatar
} from "@material-ui/core";

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
		id: "name",
		numeric: false,
		disablePadding: true,
		label: "Name"
	},
	{
		id: "isConfirmed",
		numeric: false,
		disablePadding: true,
		label: "Confirmed"
	},
	{
		id: "type",
		numeric: false,
		disablePadding: true,
		label: "Type"
	}
];

function EnhancedTableHead(props) {
  const {
    classes,
    order,
    orderBy,
	onRequestSort,
	isViewAll
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
		{isViewAll ? (<></>) : (<TableCell align={"center"}>Actions</TableCell>)}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  isViewAll: PropTypes.bool.isRequired
};

const useToolbarStyles = makeStyles(theme => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
    marginTop: theme.spacing(1)
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85)
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark
        },
  title: {
    flex: "1 1 100%"
  }
}));

const EnhancedTableToolbar = props => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <>
      {numSelected > 0 && (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
        >
          {numSelected} selected
        </Typography>
      )}
    </>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
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
  }
}));

export default function ParticipantTable({ participants, isViewAll }) {
  const { id } = useParams();
  const { post } = useRequest();
  const classes = useStyles();
  const [errors, setErrors] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [failureOpen, setFailureOpen] = React.useState(false);

  const handleSuccessClose = () => {
	setSuccessOpen(false);
  };

  const handleFailureClose = () => {
	setFailureOpen(false);
  };

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === "desc";
    setOrder(isDesc ? "asc" : "desc");
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = participants.map(n => n.email);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

	const handleFeedbackEmail = async (email) => {
		let response = await post(config.SEND_FEEDBACK_EMAIL_POST_URL, {
			EventId: id,
			Data: email
		});

		if (response.success) {
			setSuccessOpen(true);
		}
		else {
			setErrors(response.errors);
			setFailureOpen(true);
		}
	};

	const handleConfirmEmail = async (email) => {
		let response = await post(config.SEND_CONFIRMATION_EMAIL_POST_URL, {
			EventId: id,
			Data: email
		});

		if (response.success) {
			setSuccessOpen(true);
		}
		else {
			setErrors(response.errors);
			setFailureOpen(true);
		}
	};

  const isSelected = title => selected.indexOf(title) !== -1;

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, participants.length - page * rowsPerPage);

  function getType(type) {
		switch (type) {
		  case 0:
			return "Volunteer";
		  case 1:
			return "Attendee";
		  case 2:
			return "Donor";
		  default:
			return "Attendee";

		}
	}

	function getConfirmed(isConfirmed) {
		switch (isConfirmed) {
			case false:
				return "No";
			case true:
				return "Yes";
			default:
				return "No";
		}
	}

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
			  classes={classes}
			  numSelected={selected.length}
			  order={order}
			  orderBy={orderBy}
			  onSelectAllClick={handleSelectAllClick}
			  onRequestSort={handleRequestSort}
			  rowCount={participants.length}
			  isViewAll={isViewAll}
            />
            <TableBody>
              {stableSort(participants, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((participant, index) => {
                  const isItemSelected = isSelected(participant.email);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
					  key={participant.email + "-" + participant.dateEntered}
                      selected={isItemSelected}
                    >
					  <TableCell data-tip data-for="participant-tool-tip" component="th" id={labelId} scope="row">
						<CopyToClipboard text={participant.email}>
						  <span style={{ cursor: "pointer" }}>{participant.email}</span>
						</CopyToClipboard>
						<ReactTooltip
						  id="participant-tool-tip"
						  event="click"
						  eventOff="mouseleave"
						  isCapture={true}
						>
						  <p>Copied!</p>
						</ReactTooltip>
					  </TableCell>
					  <TableCell component="th" id={labelId} scope="row">
						{participant.name}
					  </TableCell>
					  <TableCell component="th" id={labelId} scope="row">
						{getConfirmed(participant.isConfirmed)}
					  </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {getType(participant.type)}
					  </TableCell>
					  {isViewAll ?
						(<></>) :
						(<TableCell component="th" id={labelId} scope="row" align="center">
							<ButtonGroup color="primary" aria-label="outlined primary button group">
								<Button
									variant="outlined"
									id={participant.email}
									disabled={participant.feedbackSent ? true : false}
									onClick={() => handleFeedbackEmail(participant.email)}
								>
									Feedback
								</Button>
								<Button
									variant="outlined"
									id={participant.email}
									disabled={participant.confirmSent ? true : false}
									onClick={() => handleConfirmEmail(participant.email)}
								>
									Confirm
								</Button>
							</ButtonGroup>
					  </TableCell>)}
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
				)}
				<Dialog
					onClose={handleSuccessClose}
					open={successOpen}
					fullWidth
					PaperProps={{ style: { maxWidth: 400 } }}
				>
					<DialogTitle align="center">
						<Avatar style={{ backgroundColor: "#00cc00" }}>
							<CheckIcon fontSize="large" />
						</Avatar>
						Email sent!
					</DialogTitle>
					<DialogContent align="center"></DialogContent>
					<DialogActions>
						<Button onClick={handleSuccessClose} variant="contained">
							Close
						</Button>
					</DialogActions>
				</Dialog>
				<Dialog
					onClose={handleFailureClose}
					open={failureOpen}
					fullWidth
					PaperProps={{ style: { maxWidth: 400 } }}
				>
					<DialogTitle align="center">
						<Avatar style={{ backgroundColor: "#ff0000" }}>
							<CloseIcon fontSize="large" />
						</Avatar>
						Failure: {errors["*"]}
					</DialogTitle>
					<DialogContent align="center"></DialogContent>
					<DialogActions>
						<Button onClick={handleFailureClose} variant="contained">
							Close
						</Button>
					</DialogActions>
				</Dialog>
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={participants.length}
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
    </div>
  );
}
