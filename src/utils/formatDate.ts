export const formatDate = (date: Date | string | number | undefined) => {
  if (!date) return "-";
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return "-";
    }
    
    return dateObj.toLocaleDateString("pt-BR");
  } catch (error) {
    console.error("Erro ao formatar data:", error);
    return "-";
  }
};