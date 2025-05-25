import { useQuery } from '@apollo/client';
import { GET_PEOPLE } from '../graphql/queries';
import {
  Pagination,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Box,
} from '@mui/material';
import { LocationOn, Face,Movie } from '@mui/icons-material';

function CharacterList({ page, limit, name, onPageChange }) {
  const { loading, error, data } = useQuery(GET_PEOPLE, {
    variables: { page, limit, name },
  });

  const handlePageChange = (_, value) => onPageChange(value);

  if (loading) {
    return (
      <Box className="flex justify-center p-10">
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center">Error: {error.message}</p>;
  }

  return (
    <div >
      {/* Card Grid */}
      <Grid container spacing={2} className="flex justify-center items-center">
        {data.people.results.map((person) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={person.id}>
            <Card
             className="transition-transform duration-300"
  sx={{
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    p: 2,
    boxShadow: 3,
    borderRadius: '1rem',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-6px)',
      boxShadow: 6,
    },
  }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  color="primary"
                  sx={{ mb: 1, fontWeight: 600,width:200 }}
                >
                  {person.name}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Appearance */}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                  >
                    <Face fontSize="small" />
                    Appearance
                  </Typography>
                  <Box sx={{ pl: 2, lineHeight: 1.9, fontSize: '0.95rem' }}>
                    <Typography>Gender: <strong>{person.gender || 'Unknown'}</strong></Typography>
                    <Typography>Birth Year: <strong>{person.birthYear || 'Unknown'}</strong></Typography>
                    <Typography>Hair Color: <strong>{person.hair_color || 'Unknown'}</strong></Typography>
                    <Typography>Eye Color: <strong>{person.eye_color || 'Unknown'}</strong></Typography>
                    <Typography>Skin Color: <strong>{person.skin_color || 'Unknown'}</strong></Typography>
                  </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Origin */}
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                  >
                    <LocationOn fontSize="small" />
                    Origin
                  </Typography>
                  <Typography sx={{ pl: 2, fontSize: '0.95rem' }}>
                    Homeworld: <strong>{person.homeworld || 'Unknown'}</strong>
                  </Typography>
                </Box>

                {/* Films */}
  <Divider sx={{ my: 2 }} />

  <Box>
    <Typography
      variant="subtitle2"
      color="text.secondary"
      sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
    >
      <Movie fontSize="small" />
      Films
    </Typography>
    <Box sx={{ pl: 2, fontSize: '0.95rem', lineHeight: 1.7,height:130 }}>
      {person.films?.length > 0 ? (
        person.films.map((film, idx) => (
          <Typography key={idx}>• {film}</Typography>
        ))
      ) : (
        <Typography>Unknown</Typography>
      )}
    </Box>
  </Box>
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
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
}

export default CharacterList;
