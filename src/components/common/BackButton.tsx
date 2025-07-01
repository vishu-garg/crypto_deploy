import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button } from '@mui/material';

type BackButtonProps = {
  onClick: () => void;
};

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      startIcon={<ArrowBackIcon />}
      onClick={onClick}
      sx={{ mb: 2 }}
    >
      Back
    </Button>
  );
};

export default BackButton;
