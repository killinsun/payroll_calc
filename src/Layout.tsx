import { Box, Container, useTheme } from "@mui/material";
import type { FC } from "react";

type Props = {
  children: React.ReactNode;
};

export const Layout: FC<Props> = (props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        height: "100dvh",
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "stretch",
          justifyContent: "center",
          padding: {
            xs: "8px 4px",
            sm: "32px 64px",
          },
        }}
      >
        <main style={{ width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignSelf: "stretch",
            }}
          >
            {props.children}
          </Box>
        </main>
      </Container>
    </Box>
  );
};

export default Layout;
