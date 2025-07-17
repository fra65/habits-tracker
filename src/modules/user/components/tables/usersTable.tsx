'use client';

import {
  Table, TableBody, TableCaption, TableCell, TableFooter,
  TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { getUsers } from "../../api/getUsers";
import { UserOutput } from "../../types/UserOutput";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; // <--- se usi next-auth

export default function UsersTable() {
  // Stato per la lista utenti
  const [users, setUsers] = useState<UserOutput[] | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  // Dati di sessione con next-auth
  const { status } = useSession();

  useEffect(() => {

    // Call API per prendere gli 
    getUsers().then(result => {
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
          {status === 'authenticated' && !users 
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user: UserOutput) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.provider}</TableCell>
                </TableRow>
              ))}
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
