"use client";
import Image from "next/image";
import { Root, classes } from "./styles";
import { LoremIpsum } from "lorem-ipsum";
import Banner from "@public/banner.svg";
import { Box, Container, Grid, Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import Episode from "@components/Episode/Episode.jsx";
import Blog from "@components/Blog/Blog.jsx";
import PlaceholderArt from "@public/beyond-the-decades.png";
import Link from "next/link";

export default function Home() {
  const theme = useTheme();
  const lorem = new LoremIpsum({
    sentencesPerParagraph: {
      max: 8,
      min: 4,
    },
    wordsPerSentence: {
      max: 16,
      min: 4,
    },
  });
  const episodes = [
    {
      img: PlaceholderArt,
      imgAlt: "Placeholder Art",
      title: "Episode 1",
      href: "/episodes/1",
    },
    {
      img: PlaceholderArt,
      imgAlt: "Placeholder Art",
      title: "Episode 2",
      href: "/episodes/2",
    },
    {
      img: PlaceholderArt,
      imgAlt: "Placeholder Art",
      title: "Episode 3",
      href: "/episodes/3",
    },
  ];

  const blogs = [
    {
      img: PlaceholderArt,
      imgAlt: "Placeholder Art",
      title: "Episode 1",
      href: "/episodes/1",
      previewText: lorem.generateSentences(2),
    },
    {
      img: PlaceholderArt,
      imgAlt: "Placeholder Art",
      title: "Episode 2",
      href: "/episodes/2",
      previewText: lorem.generateSentences(2),
    },
    {
      img: PlaceholderArt,
      imgAlt: "Placeholder Art",
      title: "Episode 3",
      href: "/episodes/3",
      previewText: lorem.generateSentences(2),
    },
  ];

  return (
    <Root>
      <div className={classes.toolbar} />
      {/* Banner + title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image src={Banner} alt="Banner" width={500} height={300} />
        <Typography variant="h4" component="h1">
          powerful. a power metal podcast
        </Typography>
      </Box>
      {/* Container for episodes + blogs components */}
      <Grid container justifyContent="center">
        <Grid item xs={6} id="episodes" className={classes.contentContainer}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign={"center"}
          >
            Episodes
          </Typography>
          {episodes.map((episode, index) => (
            <Episode
              key={index}
              img={episode.img}
              imgAlt={episode.imgAlt}
              title={episode.title}
              href={episode.href}
            />
          ))}
          <Link href="/episodes">See more...</Link>
        </Grid>
        <Grid item xs={6} id="blogs" className={classes.contentContainer}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            textAlign={"center"}
          >
            Blogs
          </Typography>
          {blogs.map((blog, index) => (
            <Blog
              key={index}
              img={blog.img}
              imgAlt={blog.imgAlt}
              title={blog.title}
              href={blog.href}
              previewText={blog.previewText}
            />
          ))}
          <Link href="/blogs">See more...</Link>
        </Grid>
      </Grid>
    </Root>
  );
}
