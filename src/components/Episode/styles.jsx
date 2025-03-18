import { styled } from "@mui/material";

const component = "episode";

const classes = {
  container: `${component}-container`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.container}`]: {
    padding: "1.5rem 0 1.5rem 0",
    textAlign: "center",
  },
}));

export { Root, classes };
