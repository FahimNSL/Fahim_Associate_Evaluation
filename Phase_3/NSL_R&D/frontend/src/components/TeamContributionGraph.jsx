import React from 'react';
import { useGetReportsQuery } from '../store/api';
import { Box, Typography, Paper, LinearProgress } from '@mui/material';

const TeamContributionGraph = ({ projectId }) => {
  const { data, isLoading, isError } = useGetReportsQuery(projectId);

  if (isLoading) return <LinearProgress sx={{ width: '100%', mb: 2 }} />;
  if (isError) return <Typography color="error">Error loading data</Typography>;

  // Group reports by author and store count along with author name
  const reportCounts = data.reduce((counts, report) => {
    const authorId = report.author._id;
    const authorName = report.author.name;

    if (!counts[authorId]) {
      counts[authorId] = { count: 0, name: authorName };
    }
    counts[authorId].count += 1;
    return counts;
  }, {});

  return (
    <Paper sx={{ p: 3, borderRadius: '8px', boxShadow: 3 }}>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        Team Contribution by Reports
      </Typography>
      {Object.entries(reportCounts).map(([authorId, { count, name }]) => (
        <Box key={authorId} sx={{ my: 2, display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ width: '150px', fontWeight: '600' }}>
            {name}
          </Typography>
          <Box sx={{ flexGrow: 1, mr: 2 }}>
            <Box
              sx={{
                width: '100%',
                height: '10px',
                backgroundColor: 'grey.300',
                borderRadius: '5px',
              }}
            >
              <Box
                sx={{
                  width: `${Math.min(count * 10, 100)}%`, // Cap the width for visualization
                  height: '100%',
                  backgroundColor: 'primary.main',
                  borderRadius: '5px',
                }}
              />
            </Box>
          </Box>
          <Typography variant="body1" sx={{ minWidth: '40px', textAlign: 'right', fontWeight: '600' }}>
            {count}
          </Typography>
        </Box>
      ))}
    </Paper>
  );
};

export default TeamContributionGraph;
