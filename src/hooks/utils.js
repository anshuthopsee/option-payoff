export const joinWords = (inputString) => {
  const wordsArray = inputString.split(' ');
  const lowercasedWords = wordsArray.map(word => word);
  return lowercasedWords.join('-');
};

export const splitWords = (hyphenSeparatedString) => {
  hyphenSeparatedString = hyphenSeparatedString;
  const lowercaseWords = hyphenSeparatedString.split('-');
  return lowercaseWords.join(' ');
};

export const getPathName = (location) => {
  let pathName = location.hash.slice(2);
  const indexOfSlash = pathName.indexOf('/');
  
  if (indexOfSlash !== -1) {
    pathName =  pathName.slice(0, indexOfSlash);
  };
  pathName = splitWords(pathName);
  return pathName;
};