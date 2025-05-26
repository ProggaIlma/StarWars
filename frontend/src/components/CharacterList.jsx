import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PEOPLE } from '../graphql/queries';
import CharacterDetailModal from '../components/CharacterDetailModal';
import {
  Pagination,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,Avatar,
  Box,
} from '@mui/material';

import { Face, Wc, Event, Palette } from '@mui/icons-material';
function CharacterList({ page, limit, name, onPageChange }) {
  const { loading, error, data } = useQuery(GET_PEOPLE, {
    variables: { page, limit, name },
  });

  const [selectedId, setSelectedId] = useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = (id) => {
    console.log(id);
    
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedId(null);
  };

  if (loading) {
    return (
      <Box className="flex justify-center p-10">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" align="center">Error: {error.message}</Typography>;
  }

  return (
    <div>
      {/* Grid of cards */}
      <Grid container spacing={2} className="flex justify-center items-center">
        {data.people.results.map((person) => (
          <Grid item xs={12} sm={6} md={6} lg={4} key={person?.id}>
            <Card
      onClick={() => {
        handleOpen(person?.id);
        console.log(person?.id);
      }}
      sx={{
        cursor: 'pointer',
        borderRadius: '1.25rem',
        p: 2,
        height: '100%',
        background: 'linear-gradient(145deg, #f5f5f5, #ffffff)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.05)',
        transition: '0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent>
        {/* Name + Avatar */}
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            sx={{
              bgcolor: '#1976d2',
              color: 'white',
              width: 48,
              height: 48,
              mr: 2,
              fontWeight: 'bold',
              fontSize: '1.1rem',
            }}
          >
            {person?.name?.charAt(0)}
          </Avatar>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'primary.main',
              flexGrow: 1,
              lineHeight: 1.2,
              width:200
            }}
          >
            {person?.name}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Info rows */}
      <Grid container direction="column" spacing={1}>
  <Grid item >
    <Box display="flex" alignItems="center" gap={1}>
      <Wc fontSize="small" sx={{ color: 'text.secondary' }} />
      <Typography variant="body2">
        <strong>Gender:</strong> {person?.gender || 'Unknown'}
      </Typography>
    </Box>
  </Grid>
  <Grid item >
    <Box display="flex" alignItems="center" gap={1}>
      <Palette fontSize="small" sx={{ color: 'text.secondary' }} />
      <Typography variant="body2">
        <strong>Skin:</strong> {person?.skin_color || 'Unknown'}
      </Typography>
    </Box>
  </Grid>
  <Grid item >
    <Box display="flex" alignItems="center" gap={1}>
      <Event fontSize="small" sx={{ color: 'text.secondary' }} />
      <Typography variant="body2">
        <strong>Birth Year:</strong> {person?.birthYear || 'Unknown'}
      </Typography>
    </Box>
  </Grid>
</Grid>

      </CardContent>
    </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      <Box className="flex justify-center py-6">
        <Pagination
          count={data.people.totalPages}
          page={data.people.currentPage}
          onChange={(_, value) => onPageChange(value)}
          color="primary"
        />
      </Box>

      {/* Modal */}
      {selectedId && (
        <CharacterDetailModal open={open} handleClose={handleClose} id={selectedId} />
      )}
    </div>
  );
}

export default CharacterList;
