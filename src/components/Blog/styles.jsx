import { styled } from "@mui/material";

const component = "blog";

const classes = {
  container: `${component}-container`,
  art: `${component}-art`,
  textContainer: `${component}-textContainer`,
  titleText: `${component}-titleText`,
  previewText: `${component}-previewText`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.container}`]: {
    padding: "1.5rem 0 1.5rem 0",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
    objectFit: "none",
    marginTop: "1rem",
  },
  [`& .${classes.art}`]: {
    objectFit: "cover",
    width: 400,
    height: 200,
  },
  [`& .${classes.titleText}`]: {
    color: "white",
    marginBottom: "0.5rem",
    width: 400,
    textAlign: "left",
    padding: "0 0.5rem 0 0.5rem",
  },
  [`& .${classes.previewText}`]: {
    color: "white",
    textAlign: "left",
    width: 400,
    padding: "0 0.5rem 0 0.5rem",
  },
}));

export { Root, classes };
