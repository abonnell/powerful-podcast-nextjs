import { styled } from "@mui/material";

const component = "navbar";

const classes = {
  navItem: `${component}-navItem`,
  subNavItem: `${component}-subNavItem`,
  currentPage: `${component}-currentPage`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.navItem}`]: {
    color: theme.palette.text.primary,
    padding: "1rem",
    "&:hover": {
      color: theme.palette.primary.main,
    },
    textDecoration: "none",
  },
  [`& .${classes.subNavItem}`]: {
    color: theme.palette.text.primary,
    padding: "1rem",
    "&:hover": {
      color: theme.palette.primary.main,
    },
    textDecoration: "none",
  },
  [`& .${classes.currentPage}`]: {
    color: theme.palette.primary.main,
  },
}));

export { Root, classes };
