'use client';

import {
  Table, TableBody, TableCaption, TableCell, TableFooter,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { getUsersWithProfile } from "../../api/getUsers";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { OutputUserWithProfile } from "../../schema/usersOutputAdmin.schema";

export default function UsersTable() {
  // Stato per la lista utenti
  const [users, setUsers] = useState<OutputUserWithProfile[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  // Dati di sessione con next-auth
  const { status } = useSession();

  useEffect(() => {

    // Call API per prendere gli 
    getUsersWithProfile().then(result => {
      setUsers(result.data);
      setMessage(result.message);
      setError(result.error);
    });

  }, []);

  return (
    <div>
          {/* {!session && "Non autenticato"} */}
          {status === "loading" && "Caricamento..."}
          {status === "unauthenticated" && "Non autenticato"}
          {status === 'authenticated' && (!users) 
            && (
              <p className={error ? "text-red-600" : ""}>{message ?? "Nessun utente trovato!"}</p>
            )}


      {users &&
       (
        <>
          <Table>
            <TableCaption>Lista di tutti gli utenti</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-start">Username</TableHead>
                <TableHead className="text-start">Email</TableHead>
                <TableHead className="text-start">Provider</TableHead>
                <TableHead className="text-start">Nome</TableHead>
                <TableHead className="text-start">Cognome</TableHead>
                <TableHead className="text-start">Data di nascita</TableHead>
                <TableHead className="text-start">Sesso</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: OutputUserWithProfile) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.provider}</TableCell>
                  <TableCell className="font-medium">{user.user_profile?.nome}</TableCell>
                  <TableCell className="font-medium">{user.user_profile?.cognome}</TableCell>
                  <TableCell className="font-medium">
                    {user.user_profile?.data_nascita
                      ? new Date(user.user_profile.data_nascita).toLocaleDateString("it-IT")
                      : ""
                    }
                  </TableCell>
                  <TableCell className="font-medium">{user.user_profile?.sesso}</TableCell>
                </TableRow>
              ))}

              {/* {profiles?.map((profile: ProfileOutput) => (
                <TableRow key={profile.id}>
                  <TableCell className="font-medium">{profile.nome}</TableCell>
                  <TableCell className="font-medium">{profile.cognome}</TableCell>
                  <TableCell className="font-medium">
                    {profile.data_nascita
                      ? new Date(profile.data_nascita).toLocaleDateString("it-IT")
                      : ""
                    }
                  </TableCell>
                  <TableCell className="font-medium">{profile.sesso}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">{users.length}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </>
      )}
    </div>
  );
}
