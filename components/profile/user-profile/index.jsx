import { useState, useEffect } from "react";
import { getSession } from "next-auth/client";

import ProfileForm from "../profile-form";

import classes from "./user-profile.module.css";

function UserProfile() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function updateSession() {
      const session = await getSession();
      if (!session) {
        window.location.href = "/auth";
      } else {
        setIsLoading(false);
      }
    }

    updateSession();
  }, []);

  if (isLoading) {
    return <p className={classes.profile}>Loading...</p>;
  }

  return (
    <section className={classes.profile}>
      <h1>Your User Profile</h1>
      <ProfileForm />
    </section>
  );
}

export default UserProfile;
