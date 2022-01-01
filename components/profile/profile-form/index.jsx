import { useState } from "react";

import classes from "./profile-form.module.css";

function ProfileForm(props) {
  const [formInputValues, setFormInputValues] = useState({
    newPassword: "Qwerty78",
    oldPassword: "Qwerty789",
  });

  const { newPassword, oldPassword } = formInputValues;

  function changeHandler({ target: { name, value } }) {
    setFormInputValues((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();

    const { changePasswordHandler } = props;

    // TODO: add validation

    const normalizedNewPassword = newPassword.trim();
    const normalizedOldPassword = oldPassword.trim();

    changePasswordHandler({
      newPassword: normalizedNewPassword,
      oldPassword: normalizedOldPassword,
    });
  }

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="newPassword">New Password</label>
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          value={newPassword}
          onChange={changeHandler}
          required
        />
      </div>
      <div className={classes.control}>
        <label htmlFor="oldPassword">Old Password</label>
        <input
          type="password"
          name="oldPassword"
          id="oldPassword"
          value={oldPassword}
          onChange={changeHandler}
          required
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;
