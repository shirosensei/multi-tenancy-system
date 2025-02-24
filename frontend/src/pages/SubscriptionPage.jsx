import React from 'react';
import SubscriptionManagement from '../components/subscriptions/SubscriptionManagement';
import { Box, Container } from '@mui/material';

const SubscriptionPage = () => {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <SubscriptionManagement />
      </Box>
    </Container>
  );
};

export default SubscriptionPage;
