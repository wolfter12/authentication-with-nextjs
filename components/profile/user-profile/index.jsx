import ProfileForm from "../profile-form";

import classes from "./user-profile.module.css";

function UserProfile() {
  async function changePasswordHandler({ newPassword, oldPassword }) {
    console.info("submitHandler", { newPassword, oldPassword });

    const response = await fetch("/api/user/change-password", {
      method: "PATCH",
      body: JSON.stringify({
        newPassword,
        oldPassword,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // TODO: add notification
    console.log(data);
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm changePasswordHandler={changePasswordHandler} />
    </section>
  );
}

export default UserProfile;
