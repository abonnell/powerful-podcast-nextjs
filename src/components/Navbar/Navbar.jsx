"use client";
import { ClickAwayListener, Link, MenuList, Typography } from "@mui/material";
import {
  AppBar,
  Container,
  Toolbar,
  Box,
  Button,
  useTheme,
  Menu,
  MenuItem,
  Popper,
  Grow,
  Paper,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { Root, classes } from "./styles";
import Image from "next/image";
import Logo from "@public/logo.png";
import { useState } from "react";
import { Montserrat_Underline } from "next/font/google";
import { ExpandMore, ExpandLess } from "@mui/icons-material";

export default function Navbar({ navLinks }) {
  const path = usePathname();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpenGallery = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseGallery = () => {
    setAnchorEl(null);
  };

  // TODO: Specific styling for gallery subnav

  return (
    <Root>
      <AppBar>
        <Container>
          <Toolbar>
            <MenuList style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link href={"/"}>
                <Image src={Logo} alt="logo" width={50} height={50} href="/" />
              </Link>
              <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                {navLinks.map((item, index) => {
                  if (item.key === "Gallery") {
                    return (
                      <>
                        <MenuItem>
                          <Typography
                            key={`${item.key}-${index}`}
                            className={`${classes.navItem} ${
                              path.includes("gallery")
                                ? classes.currentPage
                                : ""
                            }`}
                            onMouseOver={handleOpenGallery}
                          >
                            {item.key.toUpperCase()}
                          </Typography>
                          {anchorEl ? <ExpandLess /> : <ExpandMore />}
                        </MenuItem>
                        {/* Gallery subnav */}
                        <Popper
                          open={Boolean(anchorEl)}
                          anchorEl={anchorEl}
                          role={undefined}
                          transition
                          disablePortal
                          // placement="bottom-start"
                          onMouseLeave={handleCloseGallery}
                        >
                          {({ TransitionProps, placement }) => (
                            <Grow
                              {...TransitionProps}
                              style={{
                                backgroundColor: "#272727",
                                transformOrigin:
                                  placement === "bottom"
                                    ? "center top"
                                    : "center bottom",
                              }}
                            >
                              <Paper>
                                <ClickAwayListener
                                  onClickAway={handleCloseGallery}
                                >
                                  <MenuList
                                    id="menu-list-grow"
                                    sx={{
                                      backgroundColor: "#272727",
                                    }}
                                  >
                                    {item.path.map(
                                      (galleryItem, galleryIndex) => (
                                        <MenuItem
                                          key={`${galleryItem.key}-${galleryIndex}`}
                                          onClick={handleCloseGallery}
                                          divider={galleryIndex == 0}
                                          sx={
                                            galleryIndex === 0
                                              ? {
                                                  marginTop: "0.5rem",
                                                }
                                              : {}
                                          }
                                        >
                                          <Link
                                            noLinkStyle
                                            href={galleryItem.path}
                                            className={`${classes.subNavItem} ${
                                              path.includes(galleryItem.path)
                                                ? classes.currentPage
                                                : ""
                                            }`}
                                          >
                                            {galleryItem.key.toUpperCase()}
                                          </Link>
                                        </MenuItem>
                                      )
                                    )}
                                  </MenuList>
                                </ClickAwayListener>
                              </Paper>
                            </Grow>
                          )}
                        </Popper>
                      </>
                    );
                  }
                  return (
                    <MenuItem>
                      <Link
                        key={`${item.key}-${index}`}
                        href={item.path}
                        className={`${classes.navItem} ${
                          path === item.path ? classes.currentPage : ""
                        }`}
                        onMouseOver={handleCloseGallery}
                      >
                        {item.key.toUpperCase()}
                      </Link>
                    </MenuItem>
                  );
                })}
              </Box>
            </MenuList>
          </Toolbar>
        </Container>
      </AppBar>
    </Root>
  );
}
