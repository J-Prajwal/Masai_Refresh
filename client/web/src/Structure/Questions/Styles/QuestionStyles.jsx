import { makeStyles } from "@material-ui/core/styles";
import styled from "styled-components";

const QuestionStyles = makeStyles((theme) => ({
  main: {
    boxSizing: "border-box",
    width: "100%",
    padding: "31px",
    wordWrap: "break-word",

    "& pre": {
      whiteSpace: "pre-wrap",
      height: "100%",
      width: "100%",
    },

    "& button": {
      border: "none",
      padding: "16px",
    },
    [theme.breakpoints.up("xs")]: {
      height: "160vh",
    },
    [theme.breakpoints.up("sm")]: {
      height: "95vh",
    },
    [theme.breakpoints.up("md")]: {
      height: "81.5vh",
    },
    [theme.breakpoints.up("lg")]: {
      height: "86vh",
    },
    [theme.breakpoints.up("xl")]: {
      height: "89vh",
    },
  },
  nextBtn: {
    minWidth: "73px",
    minHeight: "48px",
    background: "#6C8D9E",
    boxShadow: "0px 6px 12px 0px rgb(0,0,0,0.16)",
    borderRadius: "2px",
    padding: "16px",
    fontWeight: "bold",
    border: 0,
    color: "#F6F6F6",
  },
  nextDiv: {
    "@media (max-width: 530px)": {
      display: "flex",
      flexDirection: "column",
    },
  },
  btns: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0 24px",
    alignItems: "center",

    "@media (max-width: 530px)": {
      flexDirection: "column",
      padding: "0",
    },
  },
  prevBtn: {
    display: "flex",
    alignItems: "center",

    "& p": {
      padding: "16px",
      fontStyle: "normal",
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "150%",
      color: "#333434",

      "@media (max-width: 530px)": {
        padding: "0 0 0 16px",
      },
    },
  },
  skipBtn: {
    backgroundColor: "inherit",
    fontStyle: "normal",
    fontWeight: "400",
    fontSize: "16px",
    marginRight: "20px",

    "@media (max-width: 530px)": {
      marginRight: "0",
    },
  },

  cursor_pointer: {
    cursor: "pointer",
  },
}));
const PrevButton = styled.div`
  opacity: ${(props) => (props.first_question ? 0 : 1)};
  cursor: ${(props) => (props.first_question ? "default" : "pointer")};
`;

const NextButton = styled.button`
  opacity: ${(props) => (props.attempted ? 1 : 0.2)};
  cursor: ${(props) => (props.attempted ? "pointer" : "default")};
`;

export { QuestionStyles, PrevButton, NextButton };
