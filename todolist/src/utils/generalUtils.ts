
export const getFirstName = (fullName: string | null | undefined): string => {
    if (!fullName) return '';
    return fullName.split(' ')[0];
  };