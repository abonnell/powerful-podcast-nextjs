"use client";
import { Link } from "@mui/material";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Button,
  useTheme,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { Root, classes } from "./styles";
import Image from "next/image";

export default function Navbar({ navLinks }) {
  const navArr = Object.values(navLinks);
  const path = usePathname();
  const theme = useTheme();

  return (
    <Root>
      <AppBar>
        <Container>
          <Toolbar>
            <Link href={""}>
              <Image src="/logo.png" alt="logo" width={50} height={50} />
            </Link>
            <Box>
              {navArr.map((item, index) => {
                return (
                  <Button
                    // variant="text"
                    key={`${item.key}-${index}`}
                    href={item.path}
                    className={`${classes.navItem} ${
                      path === item.path ? classes.currentPage : ""
                    }`}
                  >
                    {item.key.toUpperCase()}
                  </Button>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Root>
  );
}
