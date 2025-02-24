import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Typography } from '@mui/material';
import api from '../../services/api'; // API utility

const SubscriptionManagement = () => {
  const { data: subscriptions, isLoading, error } = useQuery(['subscriptions'], async () => {
    const response = await api.get('/subscriptions'); // Fetch subscriptions
    return response.data;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching subscriptions: {error.message}</p>;

  return (
    <div>
      <h2>Tenant Subscriptions</h2>
      {subscriptions.map((sub) => (
        <Card key={sub.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{sub.tenant.name}</Typography>
            <Typography>Plan: {sub.plan}</Typography>
            <Typography>Start: {new Date(sub.startDate).toLocaleDateString()}</Typography>
            <Typography>End: {new Date(sub.endDate).toLocaleDateString()}</Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionManagement;
