import RegisterFormItem from '@component/form/RegisterFormItem';

const EmailCodeForm = () => {
  const emailCodeForm = RegisterFormItem(
    'row mb-5 mx-3',
    'emailCode',
    'MAILCODE',
    'text',
    'MAILCODE',
    'one-time-code'
  );

  return `
		<form id="emailVerifyForm" class="form">
			<div class="container">
				${emailCodeForm}
			</div>
		</form>
	`;
};

export default EmailCodeForm;
