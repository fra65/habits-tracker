import CreateHabitResponse from "../schema/CreateHabitResponse";
import prisma from "@/prisma";
import { HabitOutput, HabitOutputSchema } from "../schema/HabitOutput.schema";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { HabitInput } from "../schema/HabitsInput.schema";
// import z from "zod";

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function createHabit(data: HabitInput): Promise<CreateHabitResponse> {
  try {
    const habit = await prisma.habit.create({ data });

    const validateHabit = HabitOutputSchema.safeParse(habit);

    if (!validateHabit.success) {
      return { success: false, message: "Errore backend validazione abitudine in POST output" };
    }
    return { success: true, data: validateHabit.data };
  } catch (err: unknown) {
    console.error("Errore catturato in createHabit:", err);
    if (err instanceof PrismaClientKnownRequestError && err.code === 'P2002') {
      return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
    }
    return { success: false, message: "Esiste già un'abitudine con questo titolo. Scegli un titolo diverso." };
  }
}

export async function getAllHabits(userId: number): Promise<HabitOutput[] | null> {

    try {
        const habits = await prisma?.habit.findMany({
            where: {
                userId
            }
        })

        if(!habits) return null

        // const normalizedHabits = habits.map(habit => ({
        //     ...habit,
        //     startDate: typeof habit.startDate === 'string' ? habit.startDate : habit.startDate.toISOString(),
        //     endDate: habit.endDate ? (typeof habit.endDate === 'string' ? habit.endDate : habit.endDate.toISOString()) : undefined,
        //     targetValue: habit.targetValue === null ? undefined : habit.targetValue,
        // }));

        const validateHabits = HabitOutputSchema.array().safeParse(habits);

        // if (!validateHabits.success) {
        // console.error(validateHabits.error.format());
        // } else {
        // console.log(validateHabits.data);
        // }
        

        if(!validateHabits.success) {
            console.error("Errore di validazione nella route")
            return null
        }

        return validateHabits.data;

    } catch(err) {
        console.error("Errore backend nel recupero delle abitudini: ", err)
        throw new Error("Errore backend generico nel recupero delle abitudini")
    }

}

export async function getHabit(habitId: number, userId: number): Promise<HabitOutput | null> {

    try {
        const habit = await prisma?.habit.findFirst({
            where: {
                id: habitId,
                userId
            }
        });

        if(!habit) return null

        const validateHabits = HabitOutputSchema.safeParse(habit)

        if(!validateHabits.success) return null

        return validateHabits.data;

    } catch(err) {
        console.error("Errore nel recupero della categoria: ", err)
        throw new Error("Errore generico nel recupero della categoria")
    }

}

