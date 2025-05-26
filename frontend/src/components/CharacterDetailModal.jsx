import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Divider,
  Chip,
  Grid,
  CircularProgress,
  Paper
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_PEOPLE_DETAIL } from '../graphql/queries';
import { LocationOn, WbSunny, People, Public, Movie } from '@mui/icons-material';

const colorFromClimate = (climate) => {
  if (!climate) return 'default';
  if (climate.includes('arid')) return 'warning';
  if (climate.includes('temperate')) return 'success';
  if (climate.includes('frozen')) return 'info';
  return 'default';
};

const populationToColor = (pop) => {
  const num = parseInt(pop);
  if (isNaN(num)) return 'default';
  if (num > 1000000000) return 'error';
  if (num > 1000000) return 'warning';
  return 'success';
};

const StyledSection = ({ title, icon, children }) => (
  <Paper elevation={3} sx={{ p: 2, mb: 3, borderRadius: '1rem' }}>
    <Typography
      variant="subtitle1"
      sx={{ fontWeight: 600, display: 'flex', alignItems: 'center', mb: 1 }}
    >
      {icon}
      <span style={{ marginLeft: 8 }}>{title}</span>
    </Typography>
    <Divider sx={{ mb: 1 }} />
    {children}
  </Paper>
);

const CharacterDetailModal = ({ open, handleClose, id }) => {
  const { data, loading } = useQuery(GET_PEOPLE_DETAIL, {
    variables: { personId: Number(id) },
    skip: !id,
  });

  if (!id || loading) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Loading character...</DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  const person = data?.person;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5" fontWeight={700} color="primary">
          {person?.name}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {/* Appearance Section */}
        <StyledSection title="Appearance" icon={<People fontSize="small" />}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2"><strong>Gender:</strong> {person?.gender}</Typography>
              <Typography variant="body2"><strong>Birth Year:</strong> {person?.birthYear}</Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2"><strong>Skin:</strong> {person?.skin_color}</Typography>
              <Typography variant="body2"><strong>Hair:</strong> {person?.hair_color}</Typography>
              <Typography variant="body2"><strong>Eyes:</strong> {person?.eye_color}</Typography>
            </Grid>
          </Grid>
        </StyledSection>

        {/* Homeworld Section */}
        {person?.homeworld && (
          <StyledSection title="Homeworld" icon={<Public fontSize="small" />}>
            <Typography variant="body2"><strong>Name:</strong> {person?.homeworld.name}</Typography>
            <Typography variant="body2">
              <strong>Population:</strong> {person?.homeworld.population}
              <Chip
                size="small"
                label=" "
                color={populationToColor(person?.homeworld.population)}
                sx={{ ml: 1, width: 10, height: 10 }}
              />
            </Typography>
            <Typography variant="body2">
              <strong>Climate:</strong> {person?.homeworld.climate}
              <Chip
                size="small"
                label={person?.homeworld.climate}
                color={colorFromClimate(person?.homeworld.climate)}
                sx={{ ml: 1 }}
              />
            </Typography>
            <Typography variant="body2"><strong>Terrain:</strong> {person?.homeworld.terrain}</Typography>
            <Typography variant="body2"><strong>Gravity:</strong> {person?.homeworld.gravity}</Typography>
            <Typography variant="body2"><strong>Diameter:</strong> {person?.homeworld.diameter} km</Typography>
          </StyledSection>
        )}

        {/* Films Section */}
        <StyledSection title="Films" icon={<Movie fontSize="small" />}>
          {person?.films?.length > 0 ? (
            <ul style={{ paddingLeft: '1rem', marginTop: 4 }}>
              {person?.films.map((film, i) => (
                <li key={i}>
                  <Typography variant="body2">{film}</Typography>
                </li>
              ))}
            </ul>
          ) : (
            <Typography variant="body2">No films found.</Typography>
          )}
        </StyledSection>
      </DialogContent>
    </Dialog>
  );
};

export default CharacterDetailModal;
