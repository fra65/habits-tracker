'use client';

import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import ChangePasswordModal from '../modals/changePasswordModal';

const ChangePasswordForm = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (

    <>

      <div className="max-w-4xl mx-auto mb-4">
        <h1 className="font-medium text-muted-foreground">Cambia Password</h1>
      </div>

      <div className="flex justify-between max-w-4xl mx-auto items-center">
        <h1>Clicca per cambiare la password</h1>
        <Button
          type="button"
          className="bg-primary cursor-pointer"
          onClick={handleOpenModal}
        >
          Cambia Password
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
