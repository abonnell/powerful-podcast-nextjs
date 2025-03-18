import Image from "next/image";
import { Box, Typography, useTheme } from "@mui/material";
import { Root, classes } from "./styles";
import Link from "next/link";

export default function Episode({ img, imgAlt, title, href }) {
  const theme = useTheme();
  return (
    <Root>
      <Box className={classes.container}>
        <Typography variant="h5" component="h2" pb="0.5rem">
          {title}
        </Typography>
        <Link href={href}>
          <Image src={img} alt={imgAlt} width={400} height={400} />
        </Link>
      </Box>
    </Root>
  );
}
