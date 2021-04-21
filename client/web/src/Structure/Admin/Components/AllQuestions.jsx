import { useEffect } from "react";
import { adminActions } from "../State/action";
import { useSelector, useDispatch } from "react-redux";
import { Row } from "./Row";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  Card,
  CardContent,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

export const AllQuestions = ({ handleDelete, topics, page, rowsPerPage }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const questions = useSelector((state) => state.admin.data);
  const isLoading = useSelector((state) => state.admin.isLoading);
  const questionDeletionStatus = useSelector(
    (state) => state.admin.questionDeletionStatus
  );
  const questionAddedStatus = useSelector(
    (state) => state.admin.questionAddedStatus
  );

  const handleChangePage = (event, newPage) => {
    const params = new URLSearchParams();
    params.append("page", newPage + 1);
    params.append("rowsPerPage", rowsPerPage);
    history.push({ search: params.toString() });
  };

  const handleChangeRowsPerPage = (event) => {
    const params = new URLSearchParams();
    params.append("page", page);
    params.append("rowsPerPage", event.target.value);
    history.push({ search: params.toString() });
  };

  useEffect(() => {
    dispatch(adminActions.getQuestionsRequest(page, rowsPerPage));
  }, [
    page,
    rowsPerPage,
    questionDeletionStatus,
    questionAddedStatus,
    dispatch,
  ]);

  return !isLoading && questions.questions !== undefined ? (
    <Card>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Verified</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.questions.current?.map((item) => (
              <Row handleDelete={handleDelete} key={item._id} item={item} />
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={questions.questions.totalCount}
          rowsPerPage={rowsPerPage}
          page={page - 1}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  ) : (
    <div>Loading...</div>
  );
};
