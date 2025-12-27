'use client';

import css from './EditProfilePage.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { checkSession, getMe, updateMe } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';

function EditProfile() {
  const router = useRouter();

  const user = useAuthStore(state => state.user);
  const setUser = useAuthStore(state => state.setUser);
  const clearIsAuthenticated = useAuthStore(
    state => state.clearIsAuthenticated
  );

  const [newUsername, setNewUsername] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          const isAuth = await checkSession();
          if (isAuth) {
            const fetchedUser = await getMe();
            if (fetchedUser) {
              setUser(fetchedUser);
              setNewUsername(fetchedUser.username || '');
            }
          } else {
            clearIsAuthenticated();
          }
        } catch {
          clearIsAuthenticated();
        }
      } else {
        setNewUsername(user.username || '');
      }

      setLoading(false);
    };

    fetchUser();
  }, [user, setUser, clearIsAuthenticated]);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(event.target.value);
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;

    try {
      await updateMe({ username: newUsername });
      setUser({ ...user, username: newUsername });
      router.push('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (loading) return null;

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image
          src={user?.avatar || '/default-avatar.png'}
          alt="User Avatar"
          width={120}
          height={120}
          className={css.avatar}
        />

        <form className={css.profileInfo} onSubmit={handleSave}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={newUsername}
              onChange={handleUsernameChange}
              className={css.input}
            />
          </div>

          <p>Email: {user?.email}</p>

          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default EditProfile;
