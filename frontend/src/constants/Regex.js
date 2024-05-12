const Regex = {
  email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-z]{2,4}(\.[a-z]{2,4})?$/,
  nickname: /^[\w가-힣]{2,10}$/,
  password: /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
  passcode: /[a-zA-Z0-9]{6}$/,
};

export default Regex;
