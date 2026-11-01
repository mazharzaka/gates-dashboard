export const getLoginValidation = (t) => ({
  username: {
    required: t ? t("usernameRequired") : "اسم المستخدم مطلوب",
    minLength: {
      value: 3,
      message: t
        ? t("usernameMinLength")
        : "يجب أن يتكون اسم المستخدم من 3 أحرف على الأقل",
    },
  },
  password: {
    required: t ? t("passwordRequired") : "كلمة المرور مطلوبة",
    minLength: {
      value: 4,
      message: t
        ? t("passwordMinLength")
        : "يجب أن تتكون كلمة المرور من 4 أحرف على الأقل",
    },
  },
});

export const loginValidation = getLoginValidation();
