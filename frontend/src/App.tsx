import React, { useState } from 'react';
import Axios from 'axios';
import { Box, Button, makeStyles, Snackbar } from '@material-ui/core';
import Reports from './components/Reports/Reports';

const App = () => {
  const [uploading, setUploading] = useState({
    listings: false,
    contacts: false,
  });
  const upload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    fileName: string,
  ) => {
    let formData = new FormData();
    const file = event.target.files![0];
    formData.append('file', file);
    await Axios.post('http://localhost:3005/upload', formData);
    setUploading({ ...uploading, [fileName]: true });
  };

  return (
    <Box>
      <Button
        variant="contained"
        component="label"
        disabled={uploading['listings']}>
        Upload Listing Data
        <input
          type="file"
          onChange={(event) => upload(event, 'listings')}
          hidden
        />
      </Button>
      <Button
        variant="contained"
        component="label"
        disabled={uploading['contacts']}>
        Upload Contacts Data
        <input
          type="file"
          onChange={(event) => upload(event, 'contacts')}
          hidden
        />
      </Button>

      {uploading.contacts && uploading.listings ? (
        <Reports />
      ) : (
        <Box>Please Upload the Files to be able to see the Reports</Box>
      )}
    </Box>
  );
};

export default App;
