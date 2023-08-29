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

export const getHash = () => {
  let inputText = window.location.hash;
  if (inputText === "") return "";
  inputText = inputText.slice(2)
  const indexOfSlash = inputText.indexOf('/');
  
  if (indexOfSlash !== -1) {
    return inputText.slice(0, indexOfSlash);
  } else {
    return inputText;
  };
};