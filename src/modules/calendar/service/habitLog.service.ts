/* eslint-disable @typescript-eslint/no-explicit-any */

import prisma from "@/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
// import { GroupedDayDetails, GroupedDayDetailSchema } from "../schema/SingleDayDetails.schema";
import { GroupedDayView, GroupedDayViewSchema } from "../schema/LogsView.schema";


export async function createHabitLog(data: any): Promise<any> {

    // console.log("Data nel backend prima di query prisma: ", data.logDate)

  try {
    const habitLog = await prisma.habitlog.create({ data });

    return { success: true, data: habitLog };
  } catch (err: unknown) {
    console.error("Errore catturato in createHabit:", err);
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
    }
    return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
  }
}


export async function getAllHabitsAndLogsView(userId: number): Promise<GroupedDayView | null> {

  try {
    const habitLogs = await prisma.habitlog.findMany({
      where: { userId },
      include: {
        habit: {
          include: { categoria: true }
        }
      },
      orderBy: {
        logDate: 'asc',
      },
    });

    console.log("habitLogs raw:", habitLogs);

    // Raggruppa per data in formato 'YYYY-MM-DD'
    const groupedByLogDate = habitLogs.reduce<Record<string, typeof habitLogs>>((acc, log) => {
      const dateKey = log.logDate.toISOString().substring(0, 10);
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(log);
      return acc;
    }, {});

    // Validazione del raggruppamento
    const correctOutput = GroupedDayViewSchema.safeParse(groupedByLogDate);

    if (!correctOutput.success) {
console.error("Validation errors:", JSON.stringify(correctOutput.error.format(), null, 2));
      return null;
    }

    return correctOutput.data;

  } catch (error) {
    console.error("Errore backend nel recupero dei logs:", error);
    return null;
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
