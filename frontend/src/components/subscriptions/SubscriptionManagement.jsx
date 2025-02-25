import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Typography } from '@mui/material';
import api from '../../services/api'; // API utility

const SubscriptionManagement = () => {
  const { data: subscriptions, isLoading, error } = useQuery(['subscriptions'], async () => {
    const response = await api.get(`${import.meta.env.VITE_API_URL}/subscriptions`); // Fetch subscriptions
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
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{sub.tenant.name}</Typography>
            <Typography>Plan: {sub.subscriptionType}</Typography>
            <Typography sx={{ color: sub.subscriptionStatus === 'Active' ? 'green' : 'red' }}>Status: {sub.subscriptionStatus}</Typography>
            <Typography>
              Start: {new Date(sub.subscriptionStartDate).toLocaleDateString()}
            </Typography>
            <Typography>
              End: {new Date(sub.subscriptionEndDate).toLocaleDateString()}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SubscriptionManagement;
