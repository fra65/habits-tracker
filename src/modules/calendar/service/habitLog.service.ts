/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


export async function createHabitLog(data: any): Promise<any> {

    // console.log("Data nel backend prima di query prisma: ", data.logDate)

  try {
    const habitLog = await prisma.habitlog.create({ data });

    // const validateHabit = HabitOutputSchema.safeParse(habit);

    // if (!validateHabit.success) {
    //   return { success: false, message: "Errore backend validazione abitudine in POST output" };
    // }

    return { success: true, data: habitLog };
  } catch (err: unknown) {
    console.error("Errore catturato in createHabit:", err);
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
    }
    return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
  }
}

export async function deleteHabitLog(habitId: number, logDate: string, userId: number): Promise<boolean> {

  const effectiveDate = new Date(logDate)

  const nextSecond = new Date(effectiveDate.getTime() + 1000);

    try {
        const habitLog = await prisma?.habitlog.deleteMany({
            where: {
                habitId,
                userId,
                logDate: {
                  gte: effectiveDate,
                  lt: nextSecond
                }
            }
        });

        if(habitLog.count === 0) return false

        return true;

    } catch(err) {
        console.error("Errore nell'eliminazione del log: ", err)
        throw new Error("Errore generico nell'eliminazione del log")
    }

}
