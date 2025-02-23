import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';

export default function SearchFilter({ onFilterChange }) {
  const [filters, setFilters] = useState({
    caseType: '',
    practiceArea: '',
    status: '',
    searchTerm: ''
  });

  const handleChange = (field) => (event) => {
    const newFilters = {
      ...filters,
      [field]: event.target.value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      caseType: '',
      practiceArea: '',
      status: '',
      searchTerm: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            label="Search Cases"
            value={filters.searchTerm}
            onChange={handleChange('searchTerm')}
            placeholder="Case number, type..."
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Case Type</InputLabel>
            <Select
              value={filters.caseType}
              label="Case Type"
              onChange={handleChange('caseType')}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="Personal Injury">Personal Injury</MenuItem>
              <MenuItem value="Family Law">Family Law</MenuItem>
              <MenuItem value="Criminal Defense">Criminal Defense</MenuItem>
              <MenuItem value="Real Estate">Real Estate</MenuItem>
              <MenuItem value="Corporate">Corporate</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Practice Area</InputLabel>
            <Select
              value={filters.practiceArea}
              label="Practice Area"
              onChange={handleChange('practiceArea')}
            >
              <MenuItem value="">All Areas</MenuItem>
              <MenuItem value="Civil Litigation">Civil Litigation</MenuItem>
              <MenuItem value="Criminal Law">Criminal Law</MenuItem>
              <MenuItem value="Family Law">Family Law</MenuItem>
              <MenuItem value="Corporate Law">Corporate Law</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={2}>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.status}
              label="Status"
              onChange={handleChange('status')}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6} md={1}>
          <Button 
            variant="outlined" 
            onClick={handleReset}
            fullWidth
            sx={{ height: '56px' }}
          >
            Reset
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}