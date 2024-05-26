const Regex = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-z]{2,4}(\.[a-z]{2,4})?$/,
  nickname: /^[\w가-힣]{2,10}$/,
  password: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
  passcode: /[a-zA-Z0-9]{6}$/,
  gameTitle: /^[\w가-힣]{1,12}$/,
  comment: /^[a-zA-Z0-9가-힣!@#$%^&*()_+{}|:"<>?`\-=[\]\\;',./]{0,20}$/,
};

export default Regex;
