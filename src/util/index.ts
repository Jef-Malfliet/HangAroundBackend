export const stringToDate = (dateString: string): Date => {
    if (!dateString) return new Date(); // fallback value
    let subStringArray = dateString.split('-');
    let intList: number[] = [];
    subStringArray.forEach(str => {
      intList.push(Number.parseInt(str));
    });
    let date: Date = new Date(intList[0], intList[1] - 1, intList[2] + 1);
    return date;
  };