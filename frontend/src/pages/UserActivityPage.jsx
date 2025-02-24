import UserActivity from '../components/useractivity/UserActivity';
import { Box, Container } from '@mui/material';

const UserActivityPage = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <UserActivity />
      </Box>
    </Container>
  );
};

export default UserActivityPage;
