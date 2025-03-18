import { styled } from "@mui/material";

const component = "home";

const classes = {
  bannerImage: `${component}-bannerImage`,
  toolbar: `${component}-toolbar`,
  contentContainer: `${component}-contentContainer`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.toolbar}`]: theme.mixins.toolbar,
  [`& .${classes.bannerImage}`]: {},
  [`& .${classes.contentContainer}`]: {
    marginTop: "5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export { Root, classes };
