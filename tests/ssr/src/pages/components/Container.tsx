import { Box } from "@chakra-ui/react";

const Container: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Box
      margin="auto"
      w="calc(100% - 32px)"
      h="100vh"
      minH="740px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      {children}
    </Box>
  );
};

export default Container;
