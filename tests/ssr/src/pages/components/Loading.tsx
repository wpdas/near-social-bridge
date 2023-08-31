import { Box, Spinner } from '@chakra-ui/react'

const Loading: React.FC<{ height?: number }> = ({ height }) => {
  return (
    <Box display="flex" w="100%" justifyContent="center" height={height}>
      <Spinner thickness="2px" speed="0.65s" emptyColor="gray.200" color="#5AE691" size="lg" />
    </Box>
  )
}

export default Loading
