import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { styled } from '@mui/material/styles';


export const CustomDateTimePicker = styled(DateTimePicker)({
  '& .MuiInputBase-root': {
    color: 'var(--text-color)',
    width: '215px',
    height: '35px',
    backgroundColor: 'var(--background-color)',
    borderRadius: '16px',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },
  '& .MuiSvgIcon-root': {
    color: 'var(--primary)',
  },
});

export const datePickerProps = {
  desktopModeMediaQuery: "(min-width: 768px)",
  format: "dddd - h:mm A",
};

export const datePickerSlotProps = {
  digitalClockSectionItem: {
    sx: {
      backgroundColor: 'var(--secondary-color)',
      borderRadius: '16px',
      '&.Mui-selected': {
        backgroundColor: 'var(--background-color)',
        color: 'var(--ascent-color) !important',
      },
      '&:hover': {
        backgroundColor: 'var(--background-color)',
      },
      color: 'var(--text-color)',
      transition: 'background-color 0.2s ease, color 0.2s ease',
    },
  },
  desktopPaper: {
    sx: {
      backgroundColor: 'var(--secondary-color)',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      overflow: 'hidden',
    }
  },
  calendarHeader: {
    sx: {
      backgroundColor: 'var(--secondary-color)',
      color: 'var(--text-color)',
      '& .MuiPickersCalendarHeader-label': {
        color: 'var(--text-color)',
      },
      '& .MuiIconButton-root': {
        color: 'var(--text-color)',
      },
    }
  },
  day: {
    sx: {
      '&.Mui-selected': {
        backgroundColor: 'var(--background-color)',
        color: 'var(--ascent-color)',
        '&:hover': {
          backgroundColor: 'var(--primary-color-dark)',
        },
      },
      '&.MuiPickersDay-root.Mui-selected': {
        backgroundColor: 'var(--background-color)',
        color: 'var(--ascent-color)',
      },
    }
  },
  actionBar: {
    sx: {
      backgroundColor: 'var(--secondary-color)',
      '& .MuiButton-root': {
        color: 'var(--ascent-color)',
      },
    },
  },
  mobilePaper: {
    sx: {
      backgroundColor: 'var(--secondary-color)',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      '& .MuiClock-root': {
        backgroundColor: 'var(--secondary-color)',
      },
      '& .MuiClock-clock': {
        backgroundColor: 'var(--background-color)',
      },
      '& .MuiClockNumber-root': {
        color: 'var(--text-color)',
        '&.Mui-selected': {
          color: 'var(--ascent-color)',
        },
      },
      '& .MuiClock-pin': {
        backgroundColor: 'var(--primary)',
      },
      '& .MuiClockPointer-root': {
        backgroundColor: 'var(--primary)',
      },
      '& .MuiClockPointer-thumb': {
        backgroundColor: 'var(--primary)',
        borderColor: 'var(--primary)',
      },
      '& .MuiPickersDay-root.Mui-selected': {
        backgroundColor: 'var(--background-color)',
        color: 'var(--ascent-color)',
      },
    },
  },
};