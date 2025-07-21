'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import ChangePasswordModal from '../modals/changePasswordModal';
import { useTranslations } from 'next-intl';

const ChangePasswordForm = () => {

  const t = useTranslations("ProfilePage")

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (

    <>

      <div className="max-w-4xl mx-auto mb-4">
        <h1 className="font-medium text-foreground">
          {t("ChangePassword.cp-title")}
        </h1>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto items-center">
        <h1 className='text-muted-foreground'>
          {t("ChangePassword.cp-desc")}
        </h1>
        <Button
          type="button"
          className="bg-primary cursor-pointer"
          onClick={handleOpenModal}
        >
          {t("Buttons.b-change-password")}
        </Button>

        {/* Modale visibile solo se showModal === true */}
        {showModal && (
          <ChangePasswordModal onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
};

export default ChangePasswordForm;
