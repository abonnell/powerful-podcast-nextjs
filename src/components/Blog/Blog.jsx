import Image from "next/image";
import { Box, Typography, useTheme } from "@mui/material";
import { Root, classes } from "./styles";
import Link from "next/link";

export default function Blog({ img, imgAlt, title, href, previewText }) {
  const theme = useTheme();
  return (
    <Root>
      <Box className={classes.container}>
        <Image src={img} alt={imgAlt} className={classes.art} />
        <Box
          sx={{
            position: "absolute",
            bottom: "0",
            right: "50%",
            transform: "translate(50%, 0)",
            background:
              "linear-gradient(to top, rgb(0, 0, 0), rgba(0, 0, 0, 0.5))",
          }}
        >
          <Typography className={classes.titleText} variant="h5" component="h2">
            {title}
          </Typography>
          <Typography
            className={classes.previewText}
            variant="body1"
            component="p"
          >
            {previewText}
          </Typography>
        </Box>
      </Box>
    </Root>
  );
}
