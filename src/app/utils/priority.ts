export const priorityColor = (priority: number) => {
  switch (priority) {
    case 1:
      return 'text-green-600';
    case 2:
      return 'text-yellow-600';
    case 3:
      return 'text-red-600';
    default:
      return '';
  }
};

export const getPriority = (priority: number) => {
  switch (priority) {
    case 1:
      return 'low';
    case 2:
      return 'mid';
    case 3:
      return 'high';
    default:
      return '';
  }
}


export const priorityOptions = ["low", "mid", "high"];