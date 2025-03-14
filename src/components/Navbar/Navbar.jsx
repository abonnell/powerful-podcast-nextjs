"use client";
import {
  ClickAwayListener,
  Divider,
  Drawer,
  Link,
  MenuList,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
import React, { useEffect, useRef, useState } from "react";
import { ExpandMore, ExpandLess, Menu as MenuIcon } from "@mui/icons-material";

export default function Navbar({ navLinks }) {
  const isInitialRender = useRef(true);
  const path = usePathname();
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const handleOpenGallery = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseGallery = () => {
    setAnchorEl(null);
  };

  const [openMenu, setOpenMenu] = useState(false);
  const handleOpenMenu = (event) => {
    setOpenMenu(true);
  };
  const handleCloseMenu = () => {
    setOpenMenu(false);
  };
  useEffect(() => {
    handleCloseMenu();
  }, [path]);

  const renderMenuItems = navLinks.map((item, index) => {
    if (item.key === "Gallery") {
      return (
        <React.Fragment key={`${item.key}-${index}`}>
          <MenuItem onMouseOver={handleOpenGallery}>
            <Typography
              className={`${classes.navItem} ${
                path.includes("gallery") ? classes.currentPage : ""
              }`}
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
            onMouseLeave={handleCloseGallery}
            placement="bottom"
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  backgroundColor: "#272727",
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Paper>
                  <ClickAwayListener onClickAway={handleCloseGallery}>
                    <MenuList
                      id="menu-list-grow"
                      sx={{
                        backgroundColor: "#272727",
                      }}
                    >
                      {item.path.map((galleryItem, galleryIndex) => (
                        <MenuItem
                          key={`${galleryItem.key}-${galleryIndex}`}
                          onClick={handleCloseGallery}
                          divider={galleryIndex == 0}
                        >
                          <Link
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
                      ))}
                    </MenuList>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      );
    }
    return (
      <MenuItem key={`${item.key}-${index}`}>
        <Link
          href={item.path}
          className={`${classes.navItem}`}
          onMouseOver={handleCloseGallery}
          style={{}}
          sx={{
            color:
              path === item.path
                ? theme.palette.primary.main
                : theme.palette.text.primary,
            textDecoration: "none !important",
          }}
        >
          {item.key.toUpperCase()}
        </Link>
      </MenuItem>
    );
  });

  // TODO: Gallery popper default open if on a gallery page
  const renderMobileMenuItems = navLinks.map((item, index) => {
    if (item.key === "Gallery") {
      return (
        <React.Fragment key={`${item.key}-${index}`}>
          <MenuItem>
            <Box
              onClick={
                Boolean(anchorEl) ? handleCloseGallery : handleOpenGallery
              }
              display={"flex"}
              alignItems={"center"}
            >
              <Typography
                className={`${classes.navItem} ${
                  path.includes("gallery") ? classes.currentPage : ""
                }`}
                sx={{
                  color: path.includes("gallery")
                    ? theme.palette.primary.main
                    : theme.palette.text.primary,
                  textDecoration: "none !important",
                }}
              >
                {item.key.toUpperCase()}
              </Typography>
              {Boolean(anchorEl) ? <ExpandLess /> : <ExpandMore />}
            </Box>
          </MenuItem>
          {/* Gallery subnav */}
          <Popper
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            role={undefined}
            transition
            disablePortal
            placement="bottom"
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{
                  transformOrigin:
                    placement === "bottom" ? "center top" : "center bottom",
                }}
              >
                <Box>
                  <MenuList id="menu-list-grow">
                    <MenuItem onClick={handleCloseGallery}>
                      <Link
                        href="/gallery"
                        className={`${classes.subNavItem} ${
                          path === "/gallery" ? classes.currentPage : ""
                        }`}
                        sx={{
                          color:
                            path === "/gallery"
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
                          textDecoration: "none !important",
                        }}
                      >
                        ALL
                      </Link>
                    </MenuItem>
                    {item.path.map((galleryItem, galleryIndex) => (
                      <MenuItem
                        key={`${galleryItem.key}-${galleryIndex}`}
                        onClick={handleCloseGallery}
                      >
                        <Link
                          href={galleryItem.path}
                          className={`${classes.subNavItem} ${
                            path.includes(galleryItem.path)
                              ? classes.currentPage
                              : ""
                          }`}
                          sx={{
                            color: path.includes(galleryItem.path)
                              ? theme.palette.primary.main
                              : theme.palette.text.primary,
                            textDecoration: "none !important",
                          }}
                        >
                          {galleryItem.key.toUpperCase()}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuList>
                </Box>
              </Grow>
            )}
          </Popper>
        </React.Fragment>
      );
    }
    return (
      <MenuItem key={`${item.key}-${index}`}>
        <Link
          href={item.path}
          className={`${classes.navItem} ${
            path === item.path ? classes.currentPage : ""
          }`}
          sx={{
            color:
              path === item.path
                ? theme.palette.primary.main
                : theme.palette.text.primary,
            textDecoration: "none !important",
          }}
          onMouseOver={handleCloseGallery}
        >
          {item.key.toUpperCase()}
        </Link>
      </MenuItem>
    );
  });

  return (
    <Root>
      <AppBar>
        {desktop && (
          <Container>
            <Toolbar>
              <MenuList
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Link href={"/"}>
                  <Image src={Logo} alt="logo" width={50} height={50} />
                </Link>
                <Box style={{ display: "flex", justifyContent: "flex-end" }}>
                  {renderMenuItems}
                </Box>
              </MenuList>
            </Toolbar>
          </Container>
        )}
        {!desktop && (
          <React.Fragment>
            <ClickAwayListener onClickAway={handleCloseMenu}>
              <Container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "1rem",
                }}
              >
                {/* Maybe replace with banner */}
                <Image src={Logo} alt="logo" width={50} height={50} />
                <Button onClick={handleOpenMenu}>
                  <MenuIcon
                    sx={{
                      color: theme.palette.text.primary,
                      fontSize: 30,
                    }}
                  />
                </Button>
                <Drawer
                  open={openMenu}
                  onClose={handleCloseMenu}
                  anchor="right"
                >
                  <MenuList>
                    <Box>{renderMobileMenuItems}</Box>
                  </MenuList>
                </Drawer>
              </Container>
            </ClickAwayListener>
          </React.Fragment>
        )}
      </AppBar>
    </Root>
  );
}
