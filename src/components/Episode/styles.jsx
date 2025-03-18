import { styled } from "@mui/material";

const component = "episode";

const classes = {
  episodeArt: `${component}-navItem`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.episodeArt}`]: {
    padding: "1.5rem 0 1.5rem 0",
    textAlign: "center",
  },
}));

export { Root, classes };
