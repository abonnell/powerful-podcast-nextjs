import Image from "next/image";
import { Typography, useTheme } from "@mui/material";
import { Root, classes } from "./styles";
import Link from "next/link";

export default function Episode({ img, imgAlt, title, href }) {
  const theme = useTheme();
  return (
    <Root>
      <div className={classes.episodeArt}>
        <Link href={href}>
          <Image src={img} alt={imgAlt} width={400} height={400} />
        </Link>
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
      </div>
    </Root>
  );
}
